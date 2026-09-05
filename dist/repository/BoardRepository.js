"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardRepository = void 0;
const Board_1 = require("../models/Board");
class BoardRepository {
    async findByGroupId(groupId) {
        return Board_1.BoardModel.find({ groupId }).lean().exec();
    }
    async findById(id) {
        return Board_1.BoardModel.findById(id).lean().exec();
    }
    async create(data) {
        const newBoard = await Board_1.BoardModel.create(data);
        return newBoard.toObject();
    }
    async update(idActualizar, data) {
        const updateBoard = await Board_1.BoardModel.findByIdAndUpdate(idActualizar, data, {
            new: true,
            runValidators: true,
        }).exec();
        return updateBoard ? updateBoard.toObject() : null;
    }
    async delete(idEliminar) {
        const resultado = await Board_1.BoardModel.findByIdAndDelete(idEliminar).exec();
        return resultado !== null;
    }
    async existById(id) {
        const existe = await Board_1.BoardModel.exists({ _id: id }).exec();
        return existe !== null;
    }
}
exports.BoardRepository = BoardRepository;
