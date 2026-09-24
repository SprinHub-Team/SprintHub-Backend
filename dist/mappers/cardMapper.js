"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardMapper = void 0;
class CardMapper {
    static toResponse(card) {
        return {
            id: card._id.toString(),
            title: card.title,
            description: card.description || '',
            columnId: card.columnId.toString(),
            assignedTo: card.assignedTo ? card.assignedTo.toString() : null,
            dueDate: card.dueDate ? card.dueDate.toISOString() : null,
            priority: card.priority,
            files: (card.files || []).map(f => ({
                fileName: f.fileName,
                url: f.url,
                path: f.path,
            })),
        };
    }
    static toDetailsResponse(card) {
        return {
            id: card._id.toString(),
            title: card.title,
            description: card.description || '',
            columnId: card.columnId.toString(),
            priority: card.priority,
            dueDate: card.dueDate ? card.dueDate.toISOString() : null,
            assignedTo: card.assignedTo ? {
                id: card.assignedTo._id.toString(),
                name: card.assignedTo.name,
                email: card.assignedTo.email,
            } : null,
            files: (card.files || []).map(f => ({
                fileName: f.fileName,
                url: f.url,
                path: f.path,
            })),
            comments: (card.comments || []).map(comment => ({
                id: comment._id.toString(),
                name: comment.name,
                description: comment.description,
                createdAt: comment.createdAt.toISOString(),
                createdBy: comment.createdBy.toString(),
            })),
        };
    }
}
exports.CardMapper = CardMapper;
