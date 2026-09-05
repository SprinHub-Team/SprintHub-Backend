"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
class CommentService {
    commentRepository;
    cardRepository;
    userRepository;
    constructor(commentRepository, cardRepository, userRepository) {
        this.commentRepository = commentRepository;
        this.cardRepository = cardRepository;
        this.userRepository = userRepository;
    }
    async findByCardId(cardId) {
        const cardExist = await this.cardRepository.existById(cardId);
        if (!cardExist) {
            throw new AppError_1.default("La card relacionada no existe.", 404);
        }
        const comments = await this.commentRepository.findByCardId(cardId);
        return comments;
    }
    async getCommentWhitDetails(commentId) {
        const comment = await this.commentRepository.findById(commentId);
        if (!comment) {
            throw new AppError_1.default("El comentario buscado no existe.", 404);
        }
        const createFor = await this.userRepository.findById(comment.createdFor.toString());
        return { ...comment, createFor };
    }
    async create(data) {
        const createdForExist = await this.userRepository.existById(data.createdFor);
        if (!createdForExist) {
            throw new AppError_1.default("El usuario relacionado no existe", 404);
        }
        const cardExist = await this.cardRepository.existById(data.cardId);
        if (!cardExist) {
            throw new AppError_1.default("La tarjeta relacionada no existe.", 404);
        }
        return this.commentRepository.create(data);
    }
    async update(id, data) {
        const commentExist = await this.commentRepository.existById(id);
        if (commentExist) {
            throw new AppError_1.default("El cometario que se intenta actualizar no existe", 404);
        }
        return await this.commentRepository.update(id, data);
    }
    async delete(id) {
        const eliminado = await this.commentRepository.delete(id);
        if (!eliminado) {
            throw new AppError_1.default("El comentario que se intenta eliminar no existe", 404);
        }
    }
}
exports.CommentService = CommentService;
