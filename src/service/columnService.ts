import { ColumnRepository } from '../repository/columnRepository';
import { BoardRepository } from '../repository/boardRepository';
import { IColumn } from '../models/Column';
import { CardRepository } from '../repository/cardRepository';
import { GroupRepository } from '../repository/groupRepository';
import ValidationError from '../errors/ValidationError';
import SupabaseStorageService from './storage/supabaseStorageService';
import { CreateColumnInput, UpdateColumnInput } from '../dtos/input/columnInputDto';
import { ColumnDetailsResponse } from '../dtos/response/columnResponseDto';
import { ColumnMapper } from '../mappers/columnMapper';

export class ColumnService{

    constructor(
        private readonly columnRepository: ColumnRepository,
        private readonly boardRepository: BoardRepository,
        private readonly cardRepository: CardRepository,
        private readonly groupRepository: GroupRepository,
        private readonly supabaseStorageService: SupabaseStorageService
    ){}

    async create(data: CreateColumnInput, userId: string): Promise<ColumnDetailsResponse>{

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

        try{

        const column = await this.columnRepository.create(data);

        return ColumnMapper.toDetailsResponse(column);

        }catch(error: unknown){

            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new ValidationError(`No se ha podido crear la columna ${errorMessage}`);

        }

    }

    async update(data: UpdateColumnInput, userId: string): Promise<ColumnDetailsResponse> {


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

        return ColumnMapper.toDetailsResponse(column);

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
