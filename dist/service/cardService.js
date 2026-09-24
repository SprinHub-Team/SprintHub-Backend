"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardService = void 0;
const ValidationError_1 = __importDefault(require("../errors/ValidationError"));
const cardMapper_1 = require("../mappers/cardMapper");
const AppError_1 = __importDefault(require("../errors/AppError"));
class CardService {
    cardRepository;
    columnRepository;
    userRepository;
    commentRepository;
    groupRepository;
    supabaseStorageService;
    constructor(cardRepository, columnRepository, userRepository, commentRepository, groupRepository, supabaseStorageService) {
        this.cardRepository = cardRepository;
        this.columnRepository = columnRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.groupRepository = groupRepository;
        this.supabaseStorageService = supabaseStorageService;
    }
    async findByColumnId(columnId, userId) {
        const columnContext = await this.columnRepository.getColumnContext(columnId);
        if (!columnContext) {
            throw new AppError_1.default('la columna relacionada no existe', 404);
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(columnContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción o la columna no existe', 403);
        }
        const cards = await this.cardRepository.findByColumnId(columnId);
        return cards.map(card => cardMapper_1.CardMapper.toResponse(card));
    }
    async getCardWhitDetails(cardId, userId) {
        const cardContext = await this.cardRepository.getCardContext(cardId);
        if (!cardContext) {
            throw new AppError_1.default('La card buscada no existe.', 404);
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(cardContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción', 403);
        }
        const card = await this.cardRepository.findById(cardId);
        if (!card) {
            throw new AppError_1.default('La card buscada no existe.', 404);
        }
        const comments = await this.commentRepository.findByCardId(cardId);
        let assignedTo = null;
        if (card.assignedTo !== undefined && card.assignedTo !== null) {
            assignedTo = await this.userRepository.findById(card.assignedTo.toString());
        }
        return cardMapper_1.CardMapper.toDetailsResponse({ ...card, comments, assignedTo });
    }
    async create(data, userId) {
        const columnContext = await this.columnRepository.getColumnContext(data.columnId);
        if (!columnContext) {
            throw new ValidationError_1.default('la columna relacionada no existe');
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(columnContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new ValidationError_1.default('El usuario no tiene permiso para realizar esta acción');
        }
        const card = await this.cardRepository.create({
            title: data.title,
            description: data.description,
            columnId: data.columnId,
            assignedTo: data.assignedTo,
            priority: data.priority
        });
        return { card: cardMapper_1.CardMapper.toResponse(card), boardId: columnContext.boardId };
    }
    async update(data, userId) {
        const cardContext = await this.cardRepository.getCardContext(data.cardId);
        if (!cardContext) {
            throw new ValidationError_1.default('La card que se intenta actualizar no existe');
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(cardContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new ValidationError_1.default('El usuario no tiene permiso para realizar esta acción');
        }
        if (data.assignedTo) {
            const asignedToExist = await this.userRepository.existById(data.assignedTo);
            if (!asignedToExist) {
                throw new ValidationError_1.default('El usuario asignado no existe');
            }
        }
        if (data.columnId) {
            const columnExist = await this.columnRepository.existById(data.columnId);
            if (!columnExist) {
                throw new ValidationError_1.default('La columna relacionada no existe');
            }
        }
        const card = await this.cardRepository.update(data.cardId, {
            description: data.description,
            title: data.title,
            columnId: data.columnId,
            assignedTo: data.assignedTo,
            priority: data.priority,
        });
        if (!card) {
            throw new ValidationError_1.default('No se ha podido actualizar la card.');
        }
        return { card: cardMapper_1.CardMapper.toResponse(card), boardId: cardContext.boardId };
    }
    async delete(id, userId) {
        const cardContext = await this.cardRepository.getCardContext(id);
        if (!cardContext) {
            throw new ValidationError_1.default('La card que se intenta eliminar no existe');
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(cardContext.groupId, userId, ['admin']);
        if (!hasPermission) {
            throw new ValidationError_1.default('El usuario no tiene permiso para realizar esta acción');
        }
        const filesPath = await this.cardRepository.getFilesPathByCardId(id);
        const eliminado = await this.cardRepository.delete(id);
        if (!eliminado) {
            throw new ValidationError_1.default('La tarjeta que se intenta elminar no existe');
        }
        if (filesPath.length > 0) {
            this.supabaseStorageService.deleteMany(filesPath);
        }
        return cardContext.boardId;
    }
    async addFile(cardId, fileData, userId) {
        const cardContext = await this.cardRepository.getCardContext(cardId);
        if (!cardContext) {
            throw new ValidationError_1.default('La card a la que se intenta adjuntar un archivo no existe');
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(cardContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new ValidationError_1.default('El usuario no tiene permiso para realizar esta acción');
        }
        const file = await this.supabaseStorageService.upload({ ...fileData, path: 'CardsFiles' });
        const card = await this.cardRepository.addFile(cardId, file);
        if (!card) {
            this.supabaseStorageService.delete(file.path);
            throw new ValidationError_1.default('No se ha podido subir el archivo.');
        }
        return { card: cardMapper_1.CardMapper.toResponse(card), boardId: cardContext.boardId };
    }
    async removeFile(data, userId) {
        const cardContext = await this.cardRepository.getCardContext(data.cardId);
        if (!cardContext) {
            throw new ValidationError_1.default('La card a la que se eliminar un archivo no existe');
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(cardContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new ValidationError_1.default('El usuario no tiene permiso para realizar esta acción');
        }
        const card = await this.cardRepository.removeFile(data);
        if (!card) {
            throw new ValidationError_1.default('No se ha podido eliminar el archivo.');
        }
        this.supabaseStorageService.delete(data.filePath);
        return { card: cardMapper_1.CardMapper.toResponse(card), boardId: cardContext.boardId };
    }
}
exports.CardService = CardService;
