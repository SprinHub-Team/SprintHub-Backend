import { ColumnRepository } from '../repository/columnRepository';
import { BoardRepository } from '../repository/boardRepository';
import { IColumn } from '../models/Column';
import { CardRepository } from '../repository/cardRepository';
import { GroupRepository } from '../repository/groupRepository';
import AppError from '../errors/AppError';
import ValidationError from '../errors/ValidationError';
import SupabaseStorageService from './storage/supabaseStorageService';
import { CreateColumnInput, UpdateColumnInput } from '../dtos/input/columnInputDto';
import { ColumnDetailsResponse, ColumnResponse } from '../dtos/response/columnResponseDto';
import { ColumnMapper } from '../mappers/columnMapper';

export class ColumnService{

    constructor(
        private readonly columnRepository: ColumnRepository,
        private readonly boardRepository: BoardRepository,
        private readonly cardRepository: CardRepository,
        private readonly groupRepository: GroupRepository,
        private readonly supabaseStorageService: SupabaseStorageService
    ){}

    async findByBoardId(boardId: string, userId: string): Promise<ColumnResponse[]>{

        const groupId = await this.boardRepository.getGroupIdByBoardId(boardId);
         if(!groupId){
            throw new AppError('El tablero relacionado no existe', 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción', 403);
        }

        const columns = await this.columnRepository.findByBoardId(boardId);

        return columns.map(column => ColumnMapper.toResponse(column));

    }

    async getColumnWhitDetails(columnId: string, userId: string): Promise<ColumnDetailsResponse>{

        const columnContext = await this.columnRepository.getColumnContext(columnId);
         if(!columnContext){
            throw new AppError('La columna que se intenta obtener no existe', 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          columnContext.groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción', 403);
        }

        const column = await this.columnRepository.findById(columnId);
        if(!column){
        throw new AppError('La columna buscada no existe.', 404);
        }
        
        const cards = await this.cardRepository.findByColumnId(columnId);

        return ColumnMapper.toDetailsResponse({...column, cards});

    }

    async create(data: CreateColumnInput, userId: string): Promise<ColumnResponse>{

        const groupId = await this.boardRepository.getGroupIdByBoardId(data.boardId);
         if(!groupId){
            throw new ValidationError('El tablero relacionado no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        }

        const column = await this.columnRepository.create(data);

        return ColumnMapper.toResponse(column);

    }

    async update(data: UpdateColumnInput, userId: string): Promise<ColumnResponse> {


        const columnContext = await this.columnRepository.getColumnContext(data.columnId);
         if(!columnContext){
            throw new ValidationError('La columna que se intenta actualizar no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          columnContext.groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        }

        const column = await this.columnRepository.update(data.columnId, data);

         if(!column){
            throw new ValidationError('La columna no se ha podido actualizar.')
        }

        return ColumnMapper.toResponse(column);

    }

    async delete(id: string, userId: string): Promise<string>{

        const columnContext = await this.columnRepository.getColumnContext(id);
        if(!columnContext){
            throw new ValidationError('La columna que se intenta actualizar no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        columnContext.groupId,
        userId,
        ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        };

        const cardsFilesPath =  await this.cardRepository.getCardFilesPathByColumnId(id);
        
        const eliminado =  await this.columnRepository.delete(id);

        if(!eliminado){
            throw new ValidationError('La columna que se intenta eliminar no existe');
        }

        if(cardsFilesPath.length > 0){

        this.supabaseStorageService.deleteMany(cardsFilesPath);
        
        }

        return columnContext.boardId;
        
    }
}
