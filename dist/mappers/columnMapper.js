"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnMapper = void 0;
const cardMapper_1 = require("./cardMapper");
class ColumnMapper {
    static toResponse(column) {
        return {
            id: column._id.toString(),
            name: column.name,
            boardId: column.boardId.toString(),
        };
    }
    static toDetailsResponse(column) {
        return {
            id: column._id.toString(),
            name: column.name,
            boardId: column.boardId.toString(),
            cards: (column.cards || []).map(card => cardMapper_1.CardMapper.toResponse(card)),
        };
    }
}
exports.ColumnMapper = ColumnMapper;
