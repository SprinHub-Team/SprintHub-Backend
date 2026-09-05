"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSockets = configureSockets;
const socket_io_1 = require("socket.io");
function configureSockets(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*', // En producción esto debería ser el dominio específico del frontend
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        },
    });
    io.on('connection', (socket) => {
        console.log(`[Socket] Usuario conectado: ${socket.id}`);
        // Prueba ping-pong
        socket.on('ping', () => {
            console.log('[Socket] Ping recibido, enviando pong...');
            socket.emit('pong', { message: '¡Pong desde el backend de SprintHub!' });
        });
        // Eventos futuros para el tablero:
        // socket.on('joinBoard', (boardId) => ...)
        // socket.on('moveCard', (data) => ...)
        socket.on('disconnect', () => {
            console.log(`[Socket] Usuario desconectado: ${socket.id}`);
        });
    });
    return io;
}
