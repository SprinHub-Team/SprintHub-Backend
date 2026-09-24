"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardPbMapper = void 0;
class CardPbMapper {
    static toResponse(cardPb) {
        return {
            id: cardPb._id.toString(),
            title: cardPb.title,
            description: cardPb.description || undefined,
            groupId: cardPb.groupId.toString(),
            sprintId: cardPb.sprintId ? cardPb.sprintId.toString() : undefined,
            assignedTo: cardPb.assignedTo ? cardPb.assignedTo.toString() : undefined,
            dueDate: cardPb.dueDate ? cardPb.dueDate.toISOString() : undefined,
            priority: cardPb.priority,
            createdAt: cardPb.createdAt.toISOString(),
            updatedAt: cardPb.updatedAt.toISOString(),
        };
    }
}
exports.CardPbMapper = CardPbMapper;
