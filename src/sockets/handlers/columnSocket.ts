import { Server } from 'socket.io';
import { AuthSocket } from '../socketAuthMiddleware';
import { columnService } from '../../dependencies/columnDependency';
import { createColumnSchema, updateColumnSchema } from '../../dtos/ColumnDto';

export function registrerColumnsHandlesr(io: Server, socket: AuthSocket){

    socket.on('column:create', async (data: {boardId: string; name: string;}, callback)=>{

    try{
        const dataParsed = createColumnSchema.parse(data);
        const column = await columnService.create(dataParsed);
        io.to(`board:${data.boardId}`).emit('column:created', column);
        callback?.({ok: true, column});
    }catch(err: any){
        callback?.({ok: false, error: err.message});
    }

    });

    // socket.on('column:reorder', async (data: {name: string; columnId: string;}, callback)=>{

    //     try{
        
    //         const dataParsed = updateColumnSchema.parse(data.name);
    //         //const column = await columnService.update(data.columnId, )
    //     }

    // });
    //         //Definir logica de negocio y finalizar implementacion de sockets


}
