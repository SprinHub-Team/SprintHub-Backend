"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const Comment_1 = require("../models/Comment");
class CommentRepository {
    async findByCardId(cardId) {
        return Comment_1.CommentModel.find({ cardId }).lean().exec();
    }
    async existById(id) {
        const existe = await Comment_1.CommentModel.exists({ _id: id }).exec();
        return existe !== null;
    }
    async findById(commentId) {
        return Comment_1.CommentModel.findById(commentId).lean().exec();
    }
    async create(data) {
        const newComment = await Comment_1.CommentModel.create(data);
        return newComment.toObject();
    }
    async update(idActualizar, data) {
        const updateComment = await Comment_1.CommentModel.findByIdAndUpdate(idActualizar, data, {
            new: true,
            runValidators: true,
        }).exec();
        return updateComment ? updateComment.toObject() : null;
    }
    async delete(idEliminar) {
        const resultado = await Comment_1.CommentModel.findByIdAndDelete(idEliminar).exec();
        return resultado !== null;
    }
    async existManyByIds(commentsIds) {
        const conteo = await Comment_1.CommentModel.countDocuments({ _id: { $in: commentsIds } }).exec();
        return conteo === commentsIds.length;
    }
}
exports.CommentRepository = CommentRepository;
