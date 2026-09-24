"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSockets = configureSockets;
exports.getIo = getIo;
const socket_io_1 = require("socket.io");
const env_1 = __importDefault(require("../config/env"));
const socketAuthMiddleware_1 = require("./socketAuthMiddleware");
const boardSocket_1 = require("./handlers/boardSocket");
const columnSocket_1 = require("./handlers/columnSocket");
const cardSocket_1 = require("./handlers/cardSocket");
const commentSocket_1 = require("./handlers/commentSocket");
let ioInstance;
function configureSockets(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: env_1.default.corsOrigin,
            methods: ['GET', 'POST']
        },
    });
    io.use(socketAuthMiddleware_1.socketAuthMiddleware);
    io.on('connection', (socket) => {
        console.log(`[Socket] Usuario ${socket.data.userId} conectado (${socket.id})`);
        (0, boardSocket_1.registerBoardHandlers)(io, socket);
        (0, columnSocket_1.registerColumnsHandlers)(io, socket);
        (0, cardSocket_1.registerCardHandlers)(io, socket);
        (0, commentSocket_1.registerCommentHandlers)(io, socket);
        socket.on('disconnect', () => {
            console.log(`[Socket] Usuario ${socket.data.userId} desconectado`);
        });
    });
    ioInstance = io;
    return io;
}
function getIo() {
    if (!ioInstance) {
        throw new Error('Socket.io no ha sido inicializado');
    }
    return ioInstance;
}
