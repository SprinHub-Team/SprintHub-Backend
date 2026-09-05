"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnRepository = void 0;
const Column_1 = require("../models/Column");
class ColumnRepository {
    async findByBoardId(boardId) {
        return Column_1.ColumnModel.find({ boardId }).lean().exec();
    }
    async findById(id) {
        return Column_1.ColumnModel.findById(id).lean().exec();
    }
    async create(data) {
        const newColumn = await Column_1.ColumnModel.create(data);
        return newColumn.toObject();
    }
    async update(idActualizar, data) {
        const updateColumn = await Column_1.ColumnModel.findByIdAndUpdate(idActualizar, data, {
            new: true,
            runValidators: true,
        }).exec();
        return updateColumn ? updateColumn.toObject() : null;
    }
    async delete(idEliminar) {
        const resultado = await Column_1.ColumnModel.findByIdAndDelete(idEliminar).exec();
        return resultado !== null;
    }
    async existManyByIds(boardsIds) {
        const conteo = await Column_1.ColumnModel.countDocuments({ _id: { $in: boardsIds } }).exec();
        return conteo === boardsIds.length;
    }
    async existById(id) {
        const existe = await Column_1.ColumnModel.exists({ _id: id }).exec();
        return existe !== null;
    }
}
exports.ColumnRepository = ColumnRepository;
