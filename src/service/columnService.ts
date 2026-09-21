import { CreateColumnDto, UpdateColumnDto } from '../dtos/ColumnDto';
import { ColumnRepository } from '../repository/columnRepository';
import { BoardRepository } from '../repository/boardRepository';
import { IColumn } from '../models/Column';
import { CardRepository } from '../repository/cardRepository';
import { GroupRepository } from '../repository/groupRepository';
import AppError from '../errors/AppError';
import ValidationError from '../errors/ValidationError';
import SupabaseStorageService from './storage/supabaseStorageService';

export class ColumnService{

    constructor(
        private readonly columnRepository: ColumnRepository,
        private readonly boardRepository: BoardRepository,
        private readonly cardRepository: CardRepository,
        private readonly groupRepository: GroupRepository,
        private readonly supabaseStorageService: SupabaseStorageService
    ){}

    async findByBoardId(boardId: string, userId: string): Promise<IColumn[]>{

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
        return columns;

    }

    async getColumnWhitDetails(columnId: string, userId: string){

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

        return {...column, cards};

    }

    async create(data: CreateColumnDto, userId: string): Promise<{column: Omit<IColumn, 'boardId'>} & {boardId: string}>{

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

        const column = await this.columnRepository.create({
            name: data.name,
            boardId: data.boardId
        });

        return {column, boardId: data.boardId}

    }

    async update(id: string, data: UpdateColumnDto, userId: string): Promise<{column: Omit<IColumn, 'boardId'>} & {boardId: string}>{


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
        }

        const column = await this.columnRepository.update(id, data);

         if(!column){
            throw new ValidationError('La columna no se ha podido actualizar.')
        }

        return {column, boardId: columnContext.boardId};

    }

    async delete(id: string, userId: string): Promise<{boardId: string;}>{

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

        const filesArray = await this.cardRepository.getFilesByColumnId(id);
        
        const eliminado =  await this.columnRepository.delete(id);
        if(!eliminado){
            throw new ValidationError('La columna que se intenta eliminar no existe');
        }

        if(filesArray!== null && filesArray.length > 0){

        this.supabaseStorageService.deleteMany(filesArray);
        
        }

        return {boardId: columnContext.boardId};
        
    }
}
