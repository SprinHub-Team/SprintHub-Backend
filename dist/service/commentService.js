"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const ValidationError_1 = __importDefault(require("../errors/ValidationError"));
const commentMapper_1 = require("../mappers/commentMapper");
class CommentService {
    commentRepository;
    cardRepository;
    userRepository;
    groupRepository;
    constructor(commentRepository, cardRepository, userRepository, groupRepository) {
        this.commentRepository = commentRepository;
        this.cardRepository = cardRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
    }
    async findByCardId(cardId, userId) {
        const cardContext = await this.cardRepository.getCardContext(cardId);
        if (!cardContext) {
            throw new AppError_1.default('La tarjeta relacionada no existe', 404);
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(cardContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción', 403);
        }
        const comments = await this.commentRepository.findByCardId(cardId);
        return comments.map(comment => commentMapper_1.CommentMapper.toResponse(comment));
    }
    async getCommentWhitDetails(commentId, userId) {
        const commentContext = await this.commentRepository.getCommentContext(commentId);
        if (!commentContext) {
            throw new AppError_1.default('El comentario que intenta obtener no existe', 404);
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(commentContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción', 403);
        }
        const comment = await this.commentRepository.findById(commentId);
        if (!comment) {
            throw new AppError_1.default('El comentario buscado no existe.', 404);
        }
        const createdBy = await this.userRepository.findById(comment.createdBy.toString());
        if (!createdBy) {
            throw new ValidationError_1.default('El usuario relacionado no existe');
        }
        return commentMapper_1.CommentMapper.toDetailsResponse({ ...comment, createdBy });
    }
    async create(data, userId) {
        const cardContext = await this.cardRepository.getCardContext(data.cardId);
        if (!cardContext) {
            throw new ValidationError_1.default('La tarjeta relacionada no existe');
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(cardContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new ValidationError_1.default('El usuario no tiene permiso para realizar esta acción');
        }
        const comment = await this.commentRepository.create({ ...data, createdBy: userId });
        return { comment: commentMapper_1.CommentMapper.toResponse(comment), boardId: cardContext.boardId };
    }
    async update(data, userId) {
        const commentContext = await this.commentRepository.getCommentContext(data.commentId);
        if (!commentContext) {
            throw new ValidationError_1.default('El comentario que intenta actualizar no existe');
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(commentContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new ValidationError_1.default('El usuario no tiene permiso para realizar esta acción');
        }
        const comment = await this.commentRepository.update(data.commentId, data);
        if (!comment) {
            throw new ValidationError_1.default('El comentario no se ha podido actualizar.');
        }
        return { comment: commentMapper_1.CommentMapper.toResponse(comment), boardId: commentContext.boardId };
    }
    async delete(id, userId) {
        const commentContext = await this.commentRepository.getCommentContext(id);
        if (!commentContext) {
            throw new ValidationError_1.default('El comentario que intenta eliminar no existe');
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(commentContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new ValidationError_1.default('El usuario no tiene permiso para realizar esta acción');
        }
        const eliminado = await this.commentRepository.delete(id);
        if (!eliminado) {
            throw new ValidationError_1.default('El comentario que se intenta eliminar no existe');
        }
        return commentContext.boardId;
    }
}
exports.CommentService = CommentService;
