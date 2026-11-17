import { setIo } from './realtime';
export { getIo } from './realtime';
import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import env from '../config/env';
import { socketAuthMiddleware, AuthSocket } from './socketAuthMiddleware';
import { registerBoardHandlers } from './handlers/boardSocket';
import { registerColumnsHandlers } from './handlers/columnSocket';
import { registerCardHandlers } from './handlers/cardSocket';
import { registerCommentHandlers } from './handlers/commentSocket';



export function configureSockets(httpServer: HttpServer){

    const io = new SocketServer(httpServer,{
        cors:{
            origin: env.corsOrigin,
            methods: ['GET', 'POST']
        },
    });

    io.use(socketAuthMiddleware);

    io.on('connection', (socket: AuthSocket)=>{
        console.log(`[Socket] Usuario ${socket.data.userId} conectado (${socket.id})`);

        registerBoardHandlers(io, socket);
        registerColumnsHandlers(io, socket);
        registerCardHandlers(io, socket);
        registerCommentHandlers(io, socket);

        socket.on('disconnect', ()=>{
            console.log(`[Socket] Usuario ${socket.data.userId} desconectado`);
        });

    });

    setIo(io);
    return io;

}
