"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrerColumnsHandlesr = registrerColumnsHandlesr;
const columnDependency_1 = require("../../dependencies/columnDependency");
const ColumnDto_1 = require("../../dtos/ColumnDto");
function registrerColumnsHandlesr(io, socket) {
    socket.on('column:create', async (data, callback) => {
        try {
            const dataParsed = ColumnDto_1.createColumnSchema.parse(data);
            const column = await columnDependency_1.columnService.create(dataParsed);
            io.to(`board:${data.boardId}`).emit('column:created', column);
            callback?.({ ok: true, column });
        }
        catch (err) {
            callback?.({ ok: false, error: err.message });
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
