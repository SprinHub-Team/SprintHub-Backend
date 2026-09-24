"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentMapper = void 0;
class CommentMapper {
    static toResponse(comment) {
        return {
            id: comment._id.toString(),
            name: comment.name,
            description: comment.description,
            cardId: comment.cardId.toString(),
            createdBy: comment.createdBy.toString(),
        };
    }
    static toDetailsResponse(comment) {
        return {
            id: comment._id.toString(),
            name: comment.name,
            description: comment.description,
            cardId: comment.cardId.toString(),
            createdAt: comment.createdAt.toISOString(),
            author: {
                id: comment.createdBy._id.toString(),
                name: comment.createdBy.name,
                email: comment.createdBy.email,
                profilePicture: comment.createdBy.profilePicture || '',
            },
        };
    }
}
exports.CommentMapper = CommentMapper;
