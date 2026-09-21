import { Server } from 'socket.io';
import { AuthSocket } from '../socketAuthMiddleware';
import { AddFileDto, addFileSchema, createCardRequest, CreateCardRequest, deleteCardRequest, DeleteCardRequest, RemoveFileDto, removeFileSchema, updateCardRequest, UpdateCardRequest } from '../../dtos/CardDto';
import { services } from '../../dependencies/serviceDependency';

const cardService = services.card;

export function registerCardHandlers(io: Server, socket: AuthSocket){

    socket.on('card:create', async (data: CreateCardRequest, callback) =>{

        try{

            const cardData = createCardRequest.parse(data);

            const {card, boardId} = await cardService.create(cardData, socket.data.userId);
            io.to(`board:${boardId}`).emit('card:created', card);
            callback?.({ok: true, card});

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

    socket.on('card:update', async(data: UpdateCardRequest, callback) =>{

        try{

            const {cardData, paramData} = updateCardRequest.parse(data);

            const {card, boardId} = await cardService.update(paramData.cardId, cardData, socket.data.userId);
            socket.to(`board:${boardId}`).emit('card:updated', card);
            callback?.({ok: true, card});

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

    socket.on('card:delete', async(data: DeleteCardRequest, callback) => {

        try{

            const cardId =  deleteCardRequest.parse(data);

            const {boardId} = await cardService.delete(cardId, socket.data.userId);
            io.to(`board:${boardId}`).emit('card:deleted', cardId);
            callback?.({ok: true});
            
        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

    socket.on('card:fileAdd', async(data: AddFileDto, callback) =>{

        try{

            const {fileData, cardId} = await addFileSchema.parseAsync(data);

            const {card, boardId} = await cardService.addFile(cardId, fileData, socket.data.userId);
            socket.to(`board:${boardId}`).emit('card:fileAdded', card);
            callback?.({ok: true, card});

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

    socket.on('card:fileRemove', async(data: RemoveFileDto, callback) =>{

        try{

            const { cardId, filePath } = removeFileSchema.parse(data);

            const {card, boardId} = await cardService.removeFile({filePath, cardId}, socket.data.userId);
            socket.to(`board:${boardId}`).emit('card:fileRemoved', card);
            callback?.({ok: true, card});

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

}