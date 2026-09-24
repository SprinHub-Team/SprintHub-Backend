"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardMapper = void 0;
class BoardMapper {
    static toResponse(board) {
        return {
            id: board._id.toString(),
            title: board.title,
            description: board.description || '',
            groupId: board.groupId.toString(),
            ownerId: board.ownerId.toString(),
        };
    }
    static toDetailsResponse(board) {
        return {
            id: board._id.toString(),
            title: board.title,
            description: board.description || '',
            groupId: board.groupId.toString(),
            columns: (board.columns || []).map(col => ({
                id: col._id.toString(),
                name: col.name,
                cards: (col.cards || []).map(card => ({
                    id: card._id.toString(),
                    title: card.title,
                    priority: card.priority,
                    dueDate: card.dueDate ? card.dueDate.toISOString() : null,
                    filesCount: card.files?.length || 0,
                })),
            })),
        };
    }
}
exports.BoardMapper = BoardMapper;
