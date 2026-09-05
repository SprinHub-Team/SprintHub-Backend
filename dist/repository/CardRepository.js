"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardRepository = void 0;
const Card_1 = require("../models/Card");
class CardRepository {
    async findByColumnId(columnId) {
        return Card_1.CardModel.find({ columnId }).lean().exec();
    }
    async findByColumnIds(columnIds) {
        return Card_1.CardModel.find({ columnId: { $in: columnIds } }).lean().exec();
    }
    async findById(id) {
        return Card_1.CardModel.findById(id).lean().exec();
    }
    async create(data) {
        const newCard = await Card_1.CardModel.create(data);
        return newCard.toObject();
    }
    async update(idActualizar, data) {
        const updateCard = await Card_1.CardModel.findByIdAndUpdate(idActualizar, data, {
            new: true,
            runValidators: true
        }).exec();
        return updateCard ? updateCard.toObject() : null;
    }
    async delete(idEliminar) {
        const resultado = await Card_1.CardModel.findByIdAndDelete(idEliminar).exec();
        return resultado !== null;
    }
    async existById(id) {
        const existe = await Card_1.CardModel.exists({ _id: id }).exec();
        return existe !== null;
    }
    async existManyByIds(ids) {
        const conteo = await Card_1.CardModel.countDocuments({ _id: { $in: ids } }).exec();
        return conteo === ids.length;
    }
}
exports.CardRepository = CardRepository;
