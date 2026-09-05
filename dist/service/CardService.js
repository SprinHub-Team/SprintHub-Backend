"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
class CardService {
    cardRepository;
    columnRepository;
    userRepository;
    commentRepository;
    constructor(cardRepository, columnRepository, userRepository, commentRepository) {
        this.cardRepository = cardRepository;
        this.columnRepository = columnRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }
    async findByColumnId(columnId) {
        const columnExist = await this.columnRepository.existById(columnId);
        if (!columnExist) {
            throw new AppError_1.default("La columna relacionada no existe", 404);
        }
        const cards = await this.cardRepository.findByColumnId(columnId);
        return cards;
    }
    async findByBoardId(boardId) {
        const columns = await this.columnRepository.findByBoardId(boardId);
        const columnIds = columns.map(c => c._id.toString());
        return this.cardRepository.findByColumnIds(columnIds);
    }
    async getCardWhitDetails(cardId) {
        const card = await this.cardRepository.findById(cardId);
        if (!card) {
            throw new AppError_1.default("El tablero buscado no existe.", 404);
        }
        const comments = await this.commentRepository.findByCardId(cardId);
        let assignedTo = null;
        if (card.assignedTo !== undefined && card.assignedTo !== null) {
            assignedTo = await this.userRepository.findById(card.assignedTo.toString());
        }
        return { ...card, comments, assignedTo };
    }
    async create(data) {
        const columnExist = await this.columnRepository.existById(data.columnId);
        if (!columnExist) {
            throw new AppError_1.default("La columna relacionada no existe", 404);
        }
        if (data.assignedTo) {
            const asignedToExist = await this.userRepository.existById(data.assignedTo);
            if (!asignedToExist) {
                throw new AppError_1.default("El usuario asignado no existe", 404);
            }
        }
        return this.cardRepository.create({
            title: data.title,
            description: data.description,
            columnId: data.columnId,
            position: data.position ?? 0,
            assignedTo: data.assignedTo,
            priority: data.priority,
            tasks: data.tasks
        });
    }
    async update(id, data) {
        const cardExist = await this.cardRepository.existById(id);
        if (!cardExist) {
            throw new AppError_1.default("La tarjeta que se intenta actualizar no existe", 404);
        }
        if (data.assignedTo) {
            const asignedToExist = await this.userRepository.existById(data.assignedTo);
            if (!asignedToExist) {
                throw new AppError_1.default("El usuario asignado no existe", 404);
            }
        }
        if (data.columnId) {
            const columnExist = await this.columnRepository.existById(data.columnId);
            if (!columnExist) {
                throw new AppError_1.default("La columna relacionada no existe", 404);
            }
        }
        return this.cardRepository.update(id, {
            description: data.description,
            title: data.title,
            position: data.position,
            columnId: data.columnId,
            assignedTo: data.assignedTo,
            priority: data.priority,
            tasks: data.tasks
        });
    }
    async delete(id) {
        const eliminado = await this.cardRepository.delete(id);
        if (!eliminado) {
            throw new AppError_1.default("La tarjeta que se intenta elminar no existe", 404);
        }
    }
}
exports.CardService = CardService;
