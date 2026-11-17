import type { Server } from 'socket.io';
let io: Server | undefined;
export function setIo(server: Server) { io = server; }
export function getIo(): Server {
  if (!io) throw new Error('Socket.io no ha sido inicializado');
  return io;
}
