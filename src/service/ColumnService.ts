import { CreateColumnDto } from "../dtos/ColumnDto";
import { ColumnRepository } from "../repository/columnRepository";
import { BoardRepository } from "../repository/boardRepository";
import AppError from "../errors/AppError";
import { IColumn } from "../models/Column";
import { CardRepository } from "../repository/cardRepository";

export class ColumnService{

    constructor(
        private columnRepository: ColumnRepository,
        private boardRepository: BoardRepository,
        private cardRepository: CardRepository
    ){}

    async findByBoardId(boardId: string): Promise<IColumn[]>{

        const boardExist = await this.boardRepository.existById(boardId);
        if(!boardExist){
            throw new AppError("El tablero relacionado no existe.",404);
        }

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

    async create(data: CreateColumnDto): Promise<IColumn>{

        const boardExist = await this.boardRepository.existById(data.boardId);
        if(!boardExist){
            throw new AppError("El tablero relacionado no existe.",404);
        }

        return this.columnRepository.create({
            name: data.name,
            boardId: data.boardId
        });

    }

    async update(id: string, data: {name: string | undefined}): Promise<IColumn | null>{

        const columnExist = await this.columnRepository.existById(id);
        if(!columnExist){
            throw new AppError("La columna que se intenta actualizae no existe.", 404)
        }

        return this.columnRepository.update(id, data);

    }

    async delete(cardId: string): Promise<void>{
        
        const eliminado =  await this.columnRepository.delete(cardId);
        if(!eliminado){
            throw new AppError("La columna que se intenta elminar no existe", 404);
        }
        
    }
}
