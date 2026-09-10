import {CreateBoardDto, UpdateBoardDto } from "../dtos/BoardDto";
import {BoardRepository} from "../repository/boardRepository";
import AppError from "../errors/AppError";
import {IBoard} from "../models/Board";
import { GroupRepository } from "../repository/groupRepository";
import { ColumnRepository } from "../repository/columnRepository";


export class BoardService{

    constructor(
        private readonly boardRepository: BoardRepository,
        private readonly groupRepository: GroupRepository,
        private readonly columnRepository: ColumnRepository
    ){}

    async findByGroupId(groupId: string): Promise<IBoard[]>{

        const boards = await this.boardRepository.findByGroupId(groupId);
        return boards;

    }

    async getBoardWhitDetails(boardId: string){

        const board = await this.boardRepository.getBoardWhitDetails(boardId);
        if(!board){
            throw new AppError("El tablero buscado no existe", 404);
        }

        return board;
    }



    async create(data: CreateBoardDto): Promise<IBoard>{

        const hasPermission  = await this.groupRepository.isMemberAndRoleValid(
          data.groupId,
          data.ownerId,
          ["admin", "collaborator"]
        );

         if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción o el grupo u usuario no existen", 403);
        }

        const newBoard = await this.boardRepository.create({
            title: data.title,
            description: data.description,
            groupId: data.groupId,
            ownerId: data.ownerId,
        });

        const boardIdStr = newBoard._id.toString();

        await Promise.all([
        this.columnRepository.create({ name: 'Por hacer', boardId: boardIdStr }),
        this.columnRepository.create({ name: 'En proceso', boardId: boardIdStr }),
        this.columnRepository.create({ name: 'Hecho', boardId: boardIdStr })
        ]);
        
        return newBoard;
    }

    async update(id: string, data: UpdateBoardDto, userId: string): Promise<IBoard | null>{

        const groupId = await this.boardRepository.getGroupIdByBoardId(id);
        if(!groupId){
            throw new AppError("El tablero que se intenta actualizar no existe", 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ["admin", "collaborator"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
        }

        return this.boardRepository.update(id,
            {title: data.title,
            description: data.description
        });
    }

    async delete(id: string, userId: string): Promise<void>{

        const groupId = await this.boardRepository.getGroupIdByBoardId(id);
        if(!groupId){
            throw new AppError("El tablero que se intenta eliminar no existe", 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ["admin"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
        }
        
        const eliminado = await this.boardRepository.delete(id);
        if(!eliminado){
            throw new AppError("El tablero que se intenta eliminar no existe", 404);
        }

    }
    
}

