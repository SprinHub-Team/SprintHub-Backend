"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnService = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const ValidationError_1 = __importDefault(require("../errors/ValidationError"));
const columnMapper_1 = require("../mappers/columnMapper");
class ColumnService {
    columnRepository;
    boardRepository;
    cardRepository;
    groupRepository;
    supabaseStorageService;
    constructor(columnRepository, boardRepository, cardRepository, groupRepository, supabaseStorageService) {
        this.columnRepository = columnRepository;
        this.boardRepository = boardRepository;
        this.cardRepository = cardRepository;
        this.groupRepository = groupRepository;
        this.supabaseStorageService = supabaseStorageService;
    }
    async findByBoardId(boardId, userId) {
        const groupId = await this.boardRepository.getGroupIdByBoardId(boardId);
        if (!groupId) {
            throw new AppError_1.default('El tablero relacionado no existe', 404);
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción', 403);
        }
        const columns = await this.columnRepository.findByBoardId(boardId);
        return columns.map(column => columnMapper_1.ColumnMapper.toResponse(column));
    }
    async getColumnWhitDetails(columnId, userId) {
        const columnContext = await this.columnRepository.getColumnContext(columnId);
        if (!columnContext) {
            throw new AppError_1.default('La columna que se intenta obtener no existe', 404);
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(columnContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción', 403);
        }
        const column = await this.columnRepository.findById(columnId);
        if (!column) {
            throw new AppError_1.default('La columna buscada no existe.', 404);
        }
        const cards = await this.cardRepository.findByColumnId(columnId);
        return columnMapper_1.ColumnMapper.toDetailsResponse({ ...column, cards });
    }
    async create(data, userId) {
        const groupId = await this.boardRepository.getGroupIdByBoardId(data.boardId);
        if (!groupId) {
            throw new ValidationError_1.default('El tablero relacionado no existe');
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new ValidationError_1.default('El usuario no tiene permiso para realizar esta acción');
        }
        const column = await this.columnRepository.create(data);
        return columnMapper_1.ColumnMapper.toResponse(column);
    }
    async update(data, userId) {
        const columnContext = await this.columnRepository.getColumnContext(data.columnId);
        if (!columnContext) {
            throw new ValidationError_1.default('La columna que se intenta actualizar no existe');
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(columnContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new ValidationError_1.default('El usuario no tiene permiso para realizar esta acción');
        }
        const column = await this.columnRepository.update(data.columnId, data);
        if (!column) {
            throw new ValidationError_1.default('La columna no se ha podido actualizar.');
        }
        return columnMapper_1.ColumnMapper.toResponse(column);
    }
    async delete(id, userId) {
        const columnContext = await this.columnRepository.getColumnContext(id);
        if (!columnContext) {
            throw new ValidationError_1.default('La columna que se intenta actualizar no existe');
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(columnContext.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new ValidationError_1.default('El usuario no tiene permiso para realizar esta acción');
        }
        ;
        const cardsFilesPath = await this.cardRepository.getCardFilesPathByColumnId(id);
        const eliminado = await this.columnRepository.delete(id);
        if (!eliminado) {
            throw new ValidationError_1.default('La columna que se intenta eliminar no existe');
        }
        if (cardsFilesPath.length > 0) {
            this.supabaseStorageService.deleteMany(cardsFilesPath);
        }
        return columnContext.boardId;
    }
}
exports.ColumnService = ColumnService;
