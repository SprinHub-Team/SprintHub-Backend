import { Server } from 'socket.io';
import { AuthSocket } from '../socketAuthMiddleware';
import { createColumnRequest, CreateColumnRequest, deleteColumnRequest, DeleteColumnRequest, updateColumnRequest, UpdateColumnRequest } from '../../dtos/ColumnDto';
import { services } from '../../dependencies/serviceDependency';

const columnService = services.column;


export function registerColumnsHandlers(io: Server, socket: AuthSocket){

    socket.on('column:create', async (data: CreateColumnRequest, callback)=>{

    try{

        const {columnData, paramData} = createColumnRequest.parse(data);
        const column = await columnService.create(columnData);

        io.to(`board:${paramData.boardId}`).emit('column:created', column);
        callback?.({ok: true, column});

    }catch(err: any){
        callback?.({ok: false, error: err.message});
    }

    });

    socket.on('column:update', async (data: UpdateColumnRequest, callback)=>{

        try{
        
            const {columnData, paramData} = updateColumnRequest.parse(data);

            const column = await columnService.update(paramData.columnId, columnData);
            socket.to(`board${paramData.boardId}`).emit('column:updated', column);
            callback?.({ok: true, column});

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

    socket.on('column:delete', async (data: DeleteColumnRequest, callback) => {

        try{

            const {boardId, columnId} = deleteColumnRequest.parse(data);

            await columnService.delete(columnId);
            io.to(`board:${boardId}`).emit('column:deleted', {columnId: columnId});
            callback?.({ok: true});

        }catch(err: any){
            callback?.({ok: false, error: err.message});
        }

    });

}
