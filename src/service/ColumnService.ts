import { CreateColumnDto } from "../dtos/ColumnDto";
import { ColumnRepository } from "../repository/ColumnRepository";
import { BoardRepository } from "../repository/BoardRepository";
import AppError from "../errors/AppError";
import { IColumn } from "../models/Column";

export class ColumnService{

    constructor(
        private columnRepository: ColumnRepository,
        private boardRepository: BoardRepository,
    ){}

    async findByBoardId(boardId: string): Promise<IColumn[]>{

        const boardExist = await this.boardRepository.existById(boardId);
        if(!boardExist){
            throw new AppError("El tablero relacionado no existe.",404);
        }

        const columns = await this.columnRepository.findByBoardId(boardId);
        if(columns.length=== 0){
            throw new AppError("Columna/s no encontrada/s",404);
        }
        return columns;

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

    async delete(cardId: string): Promise<boolean>{
        
        const eliminado =  await this.columnRepository.delete(cardId);
        if(!eliminado){
            throw new AppError("La columna que se intenta elminar no existe", 404);
        }
        
        return eliminado;

    }
}
