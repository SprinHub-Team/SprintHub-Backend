import {CreateBoardDto, UpdateBoardDto } from "../dtos/BoardDto";
import {BoardRepository} from "../repository/BoardRepository";
import AppError from "../errors/AppError";
import {IBoard} from "../models/Board";
import { UserRepository } from "../repository/UserRepository";
import { GroupRepository } from "../repository/GroupRepository";


export class BoardService{

    constructor(
        private boardRepository: BoardRepository,
        private userRepository: UserRepository,
        private groupRepository: GroupRepository
    ){}

    async findByGroupId(groupId: string): Promise<IBoard[]>{

        const groupExist = this.groupRepository.existById(groupId);
        if(!groupExist){
            throw new AppError("El grupo relacionado no existe.", 404);
        }

        const boards = await this.boardRepository.findByGroupId(groupId);

        if(boards.length === 0){
            throw new AppError("Tablero/s no encontrado/s",404);
        }
        return boards;

    }

    async create(data: CreateBoardDto): Promise<IBoard>{

        const ownerExist = this.userRepository.existById(data.ownerId);
        if(!ownerExist){
            throw new AppError("El usuario reacionado no existe", 404);
        }

        const groupExist = this.groupRepository.existById(data.groupId);
        if(!groupExist){
            throw new AppError("El grupo relacionado no existe.", 404);
        }

        return this.boardRepository.create({
            title: data.title,
            description: data.description,
            groupId: data.groupId,
            ownerId: data.ownerId,
        });

    }

    async update(id: string, data: UpdateBoardDto): Promise<IBoard | null>{

        const boardExist = await this.boardRepository.existById(id);
        if(!boardExist){
            throw new AppError("El tablero que se intenta actualizar no existe", 404);
        }

        return this.boardRepository.update(id,
            {title: data.title,
            description: data.description
        });
    }

    async delete(id: string): Promise<boolean>{
        
        const eliminado = this.boardRepository.delete(id);
        if(!eliminado){
            throw new AppError("El tablero que se intenta elminar no existe", 404);
        }

        return eliminado;
    
    }
    
}

