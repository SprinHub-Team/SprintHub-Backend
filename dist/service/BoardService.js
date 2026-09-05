"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardService = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
class BoardService {
    boardRepository;
    userRepository;
    groupRepository;
    columnRepository;
    constructor(boardRepository, userRepository, groupRepository, columnRepository) {
        this.boardRepository = boardRepository;
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.columnRepository = columnRepository;
    }
    async findByGroupId(groupId) {
        const groupExist = await this.groupRepository.existById(groupId);
        if (!groupExist) {
            throw new AppError_1.default("El grupo relacionado no existe.", 404);
        }
        const boards = await this.boardRepository.findByGroupId(groupId);
        return boards;
    }
    async getBoardWhitDetails(boardId) {
        const board = await this.boardRepository.findById(boardId);
        if (!board) {
            throw new AppError_1.default("El tablero buscado no existe.", 404);
        }
        const columns = await this.columnRepository.findByBoardId(boardId);
        const owner = await this.userRepository.findById(board.ownerId.toString());
        const group = await this.groupRepository.findById(board.groupId.toString());
        return { ...board, columns, owner, group };
    }
    async create(data) {
        const ownerExist = await this.userRepository.existById(data.ownerId);
        if (!ownerExist) {
            throw new AppError_1.default("El usuario reacionado no existe", 404);
        }
        const groupExist = await this.groupRepository.existById(data.groupId);
        if (!groupExist) {
            throw new AppError_1.default("El grupo relacionado no existe.", 404);
        }
        const newBoard = await this.boardRepository.create({
            title: data.title,
            description: data.description,
            groupId: data.groupId,
            ownerId: data.ownerId,
        });
        // Columnas predeterminadas estilo Trello
        const boardIdStr = newBoard._id.toString();
        await this.columnRepository.create({ name: 'Por hacer', boardId: boardIdStr });
        await this.columnRepository.create({ name: 'En proceso', boardId: boardIdStr });
        await this.columnRepository.create({ name: 'Hecho', boardId: boardIdStr });
        return newBoard;
    }
    async update(id, data) {
        const boardExist = await this.boardRepository.existById(id);
        if (!boardExist) {
            throw new AppError_1.default("El tablero que se intenta actualizar no existe", 404);
        }
        return this.boardRepository.update(id, { title: data.title,
            description: data.description
        });
    }
    async delete(id) {
        const eliminado = await this.boardRepository.delete(id);
        if (!eliminado) {
            throw new AppError_1.default("El tablero que se intenta elminar no existe", 404);
        }
    }
}
exports.BoardService = BoardService;
