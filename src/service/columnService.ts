import { CreateColumnDto, UpdateColumnDto } from "../dtos/ColumnDto";
import { ColumnRepository } from "../repository/columnRepository";
import { BoardRepository } from "../repository/boardRepository";
import AppError from "../errors/AppError";
import { IColumn } from "../models/Column";
import { CardRepository } from "../repository/cardRepository";
import { GroupRepository } from "../repository/groupRepository";

export class ColumnService{

    constructor(
        private readonly columnRepository: ColumnRepository,
        private readonly boardRepository: BoardRepository,
        private readonly cardRepository: CardRepository,
        private readonly groupRepository: GroupRepository
    ){}

    async findByBoardId(boardId: string): Promise<IColumn[]>{

        const columns = await this.columnRepository.findByBoardId(boardId);
        return columns;

    }

    async getColumnWhitDetails(columnId: string){

        const column = await this.columnRepository.findById(columnId);
        if(!column){
        throw new AppError("La columna buscada no existe.", 404);
        }
        
        const cards = await this.cardRepository.findByColumnId(columnId);

        return {...column, cards};

    }

    async create(data: CreateColumnDto, userId: string): Promise<{column: Omit<IColumn, 'boardId'>} & {boardId: string}>{

        const groupId = await this.boardRepository.getGroupIdByBoardId(data.boardId);
         if(!groupId){
            throw new AppError("El tablero relacionado no existe", 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ["admin", "collaborator"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
        }

        const column = await this.columnRepository.create({
            name: data.name,
            boardId: data.boardId
        });

        return {column, boardId: data.boardId}

    }

    async update(id: string, data: UpdateColumnDto, userId: string): Promise<{column: Omit<IColumn, 'boardId'> | null} & {boardId: string}>{


        const columnContext = await this.columnRepository.getColumnContext(id);
         if(!columnContext){
            throw new AppError("La columna que se intenta actualizar no existe", 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          columnContext.groupId,
          userId,
          ["admin", "collaborator"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
        }

        const column = await this.columnRepository.update(id, data);

        return {column, boardId: columnContext.boardId};

    }

    async delete(id: string, userId: string): Promise<{boardId: string;}>{

        const columnContext = await this.columnRepository.getColumnContext(id);
         if(!columnContext){
            throw new AppError("La columna que se intenta actualizar no existe", 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          columnContext.groupId,
          userId,
          ["admin", "collaborator"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
        };
        
        const eliminado =  await this.columnRepository.delete(id);
        if(!eliminado){
            throw new AppError("La columna que se intenta eliminar no existe", 404);
        }

        return {boardId: columnContext.boardId};
        
    }
}
