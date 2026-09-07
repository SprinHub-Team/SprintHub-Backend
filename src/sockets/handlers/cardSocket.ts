import { Server } from 'socket.io';
import { AuthSocket } from '../socketAuthMiddleware';
import { cardService } from '../../dependencies/cardDependency';
import { createCardRequest, CreateCardRequest, deleteCardRequest, DeleteCardRequest, updateCardRequest, UpdateCardRequest } from '../../dtos/CardDto';

export function registerCardHandlers(io: Server, socket: AuthSocket){

    socket.on('card:create', async (data: CreateCardRequest, callback) =>{

        try{

            const {cardData, paramData} = createCardRequest.parse(data);

            const card = await cardService.create(cardData);
            io.to(`board:${paramData.boardId}`).emit('card:created', card);
            callback?.({ok: true, card});

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

    socket.on('card:update', async(data: UpdateCardRequest, callback) =>{

        try{

            const {cardData, paramData} = updateCardRequest.parse(data);

            const card = await cardService.update(paramData.cardId, cardData);
            socket.to(`board:${paramData.boardId}`).emit('card:updated');
            callback?.({ok: true}, card);

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

    socket.on('card:delete', async(data: DeleteCardRequest, callback) => {

        try{

            const {boardId, cardId} =  deleteCardRequest.parse(data);

            await cardService.delete(cardId);
            io.to(`board:${boardId}`).emit('card:deleted', {cardId});
            callback?.({ok: true});
            
        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

}