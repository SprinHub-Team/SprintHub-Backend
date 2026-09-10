import { Server } from 'socket.io';
import { AuthSocket } from '../socketAuthMiddleware';
import { createCardRequest, CreateCardRequest, deleteCardRequest, DeleteCardRequest, updateCardRequest, UpdateCardRequest } from '../../dtos/CardDto';
import { services } from '../../dependencies/serviceDependency';

const cardService = services.card;

export function registerCardHandlers(io: Server, socket: AuthSocket){

    socket.on('card:create', async (data: CreateCardRequest, callback) =>{

        try{

            const {cardData, paramData} = createCardRequest.parse(data);

            const card = await cardService.create(cardData, socket.data.userId);
            io.to(`board:${paramData.boardId}`).emit('card:created', card);
            callback?.({ok: true, card});

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

    socket.on('card:update', async(data: UpdateCardRequest, callback) =>{

        try{

            const {cardData, paramData} = updateCardRequest.parse(data);

            const card = await cardService.update(paramData.cardId, cardData, socket.data.userId);
            socket.to(`board:${paramData.boardId}`).emit('card:updated', card);
            callback?.({ok: true, card});

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

    socket.on('card:delete', async(data: DeleteCardRequest, callback) => {

        try{

            const {boardId, cardId} =  deleteCardRequest.parse(data);

            await cardService.delete(cardId, socket.data.userId);
            io.to(`board:${boardId}`).emit('card:deleted', cardId);
            callback?.({ok: true});
            
        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

}