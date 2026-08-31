import {CreateBoardDto, UpdateBoardDto } from "../dtos/BoardDto";
import {BoardRepository} from "../repository/BoardRepository";
import AppError from "../errors/AppError";
import {IBoard} from "../models/Board";
import { UserRepository } from "../repository/UserRepository";
import { GroupRepository } from "../repository/GroupRepository";
import { ColumnRepository } from "../repository/ColumnRepository";


export class BoardService{

    constructor(
        private boardRepository: BoardRepository,
        private userRepository: UserRepository,
        private groupRepository: GroupRepository,
        private columnRepository: ColumnRepository
    ){}

    async findByGroupId(groupId: string): Promise<IBoard[]>{

        const groupExist = await this.groupRepository.existById(groupId);
        if(!groupExist){
            throw new AppError("El grupo relacionado no existe.", 404);
        }

        const boards = await this.boardRepository.findByGroupId(groupId);
        return boards;

    }

    async getBoardWhitDetails(boardId: string){

        const board = await this.boardRepository.findById(boardId);
        if(!board){
        throw new AppError("El tablero buscado no existe.", 404);
        }
        
        const columns = await this.columnRepository.findByBoardId(boardId);

        const owner = await this.userRepository.findById(board.ownerId.toString());

        const group = await this.groupRepository.findById(board.groupId.toString());

        return {...board, columns, owner, group};

    }



    async create(data: CreateBoardDto): Promise<IBoard>{

        const ownerExist = await this.userRepository.existById(data.ownerId);
        if(!ownerExist){
            throw new AppError("El usuario reacionado no existe", 404);
        }

        const groupExist = await this.groupRepository.existById(data.groupId);
        if(!groupExist){
            throw new AppError("El grupo relacionado no existe.", 404);
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

    async delete(id: string): Promise<void>{
        
        const eliminado = await this.boardRepository.delete(id);
        if(!eliminado){
            throw new AppError("El tablero que se intenta elminar no existe", 404);
        }

    }
    
}

