"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardService = void 0;
const ValidationError_1 = __importDefault(require("../errors/ValidationError"));
const templates_1 = require("../utils/templates");
const boardMapper_1 = require("../mappers/boardMapper");
const AppError_1 = __importDefault(require("../errors/AppError"));
class BoardService {
    boardRepository;
    groupRepository;
    columnRepository;
    supabaseStorageService;
    constructor(boardRepository, groupRepository, columnRepository, supabaseStorageService) {
        this.boardRepository = boardRepository;
        this.groupRepository = groupRepository;
        this.columnRepository = columnRepository;
        this.supabaseStorageService = supabaseStorageService;
    }
    async findByGroupId(groupId, userId) {
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }
        const boards = await this.boardRepository.findByGroupId(groupId);
        return boards.map(board => boardMapper_1.BoardMapper.toResponse(board));
    }
    async getBoardWhitDetails(boardId, userId) {
        const groupId = await this.boardRepository.getGroupIdByBoardId(boardId);
        if (!groupId) {
            throw new ValidationError_1.default('El tablero que se intenta obtener no existe');
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new ValidationError_1.default('El usuario no tiene permiso para realizar esta acción o el grupo no existe');
        }
        const board = await this.boardRepository.getBoardWhitDetails(boardId);
        if (!board) {
            throw new ValidationError_1.default('El tablero que se intenta obtener no existe');
        }
        return boardMapper_1.BoardMapper.toDetailsResponse(board);
    }
    async create(data, userId) {
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(data.groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción o el grupo u usuario no existen', 403);
        }
        const newBoard = await this.boardRepository.create({
            title: data.title,
            description: data.description,
            groupId: data.groupId,
            ownerId: userId,
        });
        const boardIdStr = newBoard._id.toString();
        let templateColumns = [
            { name: 'Por hacer', boardId: boardIdStr },
            { name: 'En proceso', boardId: boardIdStr },
            { name: 'Hecho', boardId: boardIdStr }
        ];
        if (data.templateId) {
            const template = templates_1.BOARD_TEMPLATES.find(t => t.id === data.templateId);
            if (template) {
                templateColumns = template.columns.map(c => ({
                    name: c.title,
                    boardId: boardIdStr
                }));
            }
        }
        await Promise.all(templateColumns.map(col => this.columnRepository.create(col)));
        return boardMapper_1.BoardMapper.toResponse(newBoard);
    }
    async update(id, data, userId) {
        const groupId = await this.boardRepository.getGroupIdByBoardId(id);
        if (!groupId) {
            throw new AppError_1.default('El tablero que se intenta actualizar no existe', 404);
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción', 403);
        }
        const board = await this.boardRepository.update(id, { title: data.title,
            description: data.description
        });
        if (!board) {
            throw new AppError_1.default('El tablero no se ha podido actualizar.', 500);
        }
        return boardMapper_1.BoardMapper.toResponse(board);
    }
    async delete(id, userId) {
        const groupId = await this.boardRepository.getGroupIdByBoardId(id);
        if (!groupId) {
            throw new AppError_1.default('El tablero que se intenta eliminar no existe', 404);
        }
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(groupId, userId, ['admin']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción', 403);
        }
        const cardsfilePaths = await this.columnRepository.getCardFilesPathByBoardId(id);
        const eliminado = await this.boardRepository.delete(id);
        if (!eliminado) {
            throw new AppError_1.default('El tablero que se intenta eliminar no existe', 404);
        }
        if (cardsfilePaths.length > 0) {
            await this.supabaseStorageService.deleteMany(cardsfilePaths);
        }
    }
    async applyTemplate(boardId, templateId, userId) {
        const board = await this.boardRepository.getBoardWhitDetails(boardId);
        if (!board)
            throw new AppError_1.default('Tablero no encontrado', 404);
        const groupId = board.groupId._id ? board.groupId._id.toString() : board.groupId.toString();
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission)
            throw new AppError_1.default('Sin permisos', 403);
        const template = templates_1.BOARD_TEMPLATES.find(t => t.id === templateId);
        if (!template)
            throw new AppError_1.default('Plantilla no encontrada', 404);
        const newColumns = template.columns.map(c => ({
            name: c.title,
            boardId: boardId
        }));
        await Promise.all(newColumns.map(col => this.columnRepository.create(col)));
    }
}
exports.BoardService = BoardService;
