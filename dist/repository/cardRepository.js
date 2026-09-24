"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardRepository = void 0;
const Card_1 = require("../models/Card");
const mongoose_1 = require("mongoose");
class CardRepository {
    async findByColumnId(columnId) {
        return Card_1.CardModel.find({ columnId }).lean().exec();
    }
    async findById(id) {
        return Card_1.CardModel.findById(id).lean().exec();
    }
    async getCardContext(id) {
        const resultado = await Card_1.CardModel.findById(id)
            .populate({
            path: 'columnId',
            select: 'boardId',
            populate: {
                path: 'boardId',
                select: 'groupId _id'
            }
        }).lean().exec();
        if (!resultado?.columnId?.boardId) {
            return null;
        }
        const groupId = resultado?.columnId?.boardId.groupId.toString();
        const boardId = resultado?.columnId?.boardId._id.toString();
        return { groupId, boardId };
    }
    async getCardFilesPathByColumnId(columnId) {
        const results = await Card_1.CardModel.aggregate([
            {
                $match: {
                    columnId: new mongoose_1.Types.ObjectId(columnId),
                    files: { $exists: true, $not: { $size: 0 } }
                }
            },
            {
                $unwind: '$files'
            },
            {
                $match: {
                    'files.path': { $ne: null, $exists: true }
                }
            },
            {
                $group: {
                    _id: null,
                    paths: { $addToSet: '$files.path' }
                }
            },
            {
                $project: {
                    _id: 0,
                    paths: 1
                }
            }
        ]);
        if (!results || results.length === 0) {
            return [];
        }
        return results[0].paths;
    }
    async create(data) {
        const newCard = await Card_1.CardModel.create(data);
        return newCard.toObject();
    }
    async update(idActualizar, data) {
        const updateCard = await Card_1.CardModel.findByIdAndUpdate(idActualizar, data, {
            returnDocument: 'after',
            runValidators: true
        }).exec();
        return updateCard ? updateCard.toObject() : null;
    }
    async delete(idEliminar) {
        const resultado = await Card_1.CardModel.findByIdAndDelete(idEliminar).exec();
        return resultado !== null;
    }
    async addFile(cardId, file) {
        return Card_1.CardModel.findByIdAndUpdate(cardId, { $push: { files: file } }, { new: true }).lean().exec();
    }
    async removeFile(data) {
        return Card_1.CardModel.findByIdAndUpdate(data.cardId, { $pull: { files: { path: data.filePath } } }, { new: true }).lean().exec();
    }
    async getFilesPathByCardId(cardId) {
        const card = await Card_1.CardModel.findById(cardId).select('files -_id').lean().exec();
        if (!card || card.files.length === 0) {
            return [];
        }
        const filesPath = card.files.flatMap(file => file.path !== null ? [file.path] : []);
        return filesPath;
    }
}
exports.CardRepository = CardRepository;
