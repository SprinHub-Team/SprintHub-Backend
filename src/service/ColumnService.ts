import { CreateColumnDto, UpdateColumnDto } from "../dtos/ColumnDto";
import { ColumnRepository } from "../repository/ColumnRepository";
import { BoardRepository } from "../repository/BoardRepository";
import { CardRepository } from "../repository/CardRepository";
import AppError from "../errors/AppError";
import { IColumn } from "../models/Column";
import { CardService } from "./CardService";

export class ColumnService{

    constructor(
        private columnRepository: ColumnRepository,
        private boardRepository: BoardRepository,
        private cardRepository: CardRepository,
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

        let cardsIds : string[] = [];
        if(data.cardsId && data.cardsId.length > 0){

        cardsIds = data.cardsId;

        const cardsExist = await this.cardRepository.existManyByIds(cardsIds);
        if(!cardsExist){
            throw new AppError("Una o varias de las cards relaciondas no existen.", 404);
        }

        }

        return this.columnRepository.create({
            name: data.name,
            cardsIds: cardsIds,
            boardId: data.boardId
        });

    }

    // async deleteManyByCardsIds(cardsIds: string[]): Promise<boolean>{


    //     const isDelete= this.columnRepository.deleteManyByBoardId(boardObjectId);

    // }
}
