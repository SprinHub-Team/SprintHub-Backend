import { BoardDetailsResponse, BoardResponse } from '../dtos/response/boardResponseDto';
import { CreateBoardInput, UpdateBoardInput } from '../dtos/input/boardInputDto';
import SupabaseStorageService from './storage/supabaseStorageService';
import { ColumnRepository } from '../repository/columnRepository';
import { BoardRepository} from '../repository/boardRepository';
import { GroupRepository } from '../repository/groupRepository';
import { CardRepository } from '../repository/cardRepository';
import ValidationError from '../errors/ValidationError';
import { BOARD_TEMPLATES } from '../utils/templates';
import { BoardMapper } from '../mappers/boardMapper';
import AppError from '../errors/AppError';


export class BoardService{

    constructor(
        private readonly boardRepository: BoardRepository,
        private readonly groupRepository: GroupRepository,
        private readonly columnRepository: ColumnRepository,
        private readonly cardRepository: CardRepository,
        private readonly supabaseStorageService: SupabaseStorageService
    ){}

    async findByGroupId(groupId: string, userId: string): Promise<BoardResponse[]>{

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }

        const boards = await this.boardRepository.findByGroupId(groupId);
        
        return boards.map(board => BoardMapper.toResponse(board));

    }

    async getBoardWhitDetails(boardId: string): Promise<BoardDetailsResponse> {

        const board = await this.boardRepository.getBoardWhitDetails(boardId);
        if(!board){
            throw new ValidationError('El tablero buscado no existe');
        }

        return BoardMapper.toDetailsResponse(board);
    }



    async create(data: CreateBoardInput, userId: string): Promise<BoardResponse>{

        const hasPermission  = await this.groupRepository.isMemberAndRoleValid(
          data.groupId,
          userId,
          ['admin', 'collaborator']
        );

         if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo u usuario no existen', 403);
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
            const template = BOARD_TEMPLATES.find(t => t.id === data.templateId);
            if (template) {
                templateColumns = template.columns.map(c => ({
                    name: c.title,
                    boardId: boardIdStr
                }));
            }
        }

        await Promise.all(templateColumns.map(col => this.columnRepository.create(col)));
        
        return BoardMapper.toResponse(newBoard);
    }

    async update(id: string, data: UpdateBoardInput, userId: string): Promise<BoardResponse>{

        const groupId = await this.boardRepository.getGroupIdByBoardId(id);
        if(!groupId){
            throw new AppError('El tablero que se intenta actualizar no existe', 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción', 403);
        }

        const board = await this.boardRepository.update(id,
            {title: data.title,
            description: data.description
        });

        if(!board){
            throw new AppError('El tablero no se ha podido actualizar.', 500);
        }

        return BoardMapper.toResponse(board);
    }

    async delete(id: string, userId: string): Promise<void>{

        const groupId = await this.boardRepository.getGroupIdByBoardId(id);
        if(!groupId){
            throw new AppError('El tablero que se intenta eliminar no existe', 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ['admin'],
        );

        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción', 403);
        }

        const columns = await this.columnRepository.findByBoardId(id);
        
        const eliminado = await this.boardRepository.delete(id);
        if(!eliminado){
            throw new AppError('El tablero que se intenta eliminar no existe', 404);
        }

        const filesPromises = columns.map(column => this.cardRepository.getFilesByColumnId(column._id.toString()));
        const filesArray = await Promise.all(filesPromises);

        if (filesArray && filesArray.length > 0) {
            
            const filesRemove: string[] = filesArray
            .flatMap(filesPerColumn => filesPerColumn || [])
            .filter((path): path is string => path !== null);

            if (filesRemove.length > 0) {
                await this.supabaseStorageService.deleteMany(filesRemove);
            }
        }

    }

    async applyTemplate(boardId: string, templateId: string, userId: string): Promise<void> {
        const board = await this.boardRepository.getBoardWhitDetails(boardId);
        if (!board) throw new AppError('Tablero no encontrado', 404);

        const groupId = board.groupId._id ? board.groupId._id.toString() : board.groupId.toString();

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
            groupId,
            userId,
            ['admin', 'collaborator']
        );

        if (!hasPermission) throw new AppError('Sin permisos', 403);

        const template = BOARD_TEMPLATES.find(t => t.id === templateId);
        if (!template) throw new AppError('Plantilla no encontrada', 404);

        const newColumns = template.columns.map(c => ({
            name: c.title,
            boardId: boardId
        }));

        await Promise.all(newColumns.map(col => this.columnRepository.create(col)));
    }
    
}
