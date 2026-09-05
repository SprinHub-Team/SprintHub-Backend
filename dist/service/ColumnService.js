"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnService = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
class ColumnService {
    columnRepository;
    boardRepository;
    cardRepository;
    constructor(columnRepository, boardRepository, cardRepository) {
        this.columnRepository = columnRepository;
        this.boardRepository = boardRepository;
        this.cardRepository = cardRepository;
    }
    async findByBoardId(boardId) {
        const boardExist = await this.boardRepository.existById(boardId);
        if (!boardExist) {
            throw new AppError_1.default("El tablero relacionado no existe.", 404);
        }
        const columns = await this.columnRepository.findByBoardId(boardId);
        return columns;
    }
    async getColumnWhitDetails(columnId) {
        const column = await this.columnRepository.findById(columnId);
        if (!column) {
            throw new AppError_1.default("La columna buscada no existe.", 404);
        }
        const cards = await this.cardRepository.findByColumnId(columnId);
        return { ...column, cards };
    }
    async create(data) {
        const boardExist = await this.boardRepository.existById(data.boardId);
        if (!boardExist) {
            throw new AppError_1.default("El tablero relacionado no existe.", 404);
        }
        return this.columnRepository.create({
            name: data.name,
            boardId: data.boardId
        });
    }
    async update(id, data) {
        const columnExist = await this.columnRepository.existById(id);
        if (!columnExist) {
            throw new AppError_1.default("La columna que se intenta actualizae no existe.", 404);
        }
        return this.columnRepository.update(id, data);
    }
    async delete(cardId) {
        const eliminado = await this.columnRepository.delete(cardId);
        if (!eliminado) {
            throw new AppError_1.default("La columna que se intenta elminar no existe", 404);
        }
    }
}
exports.ColumnService = ColumnService;
