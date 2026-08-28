import { CreateColumnDto, UpdateColumnDto } from "../dtos/ColumnDto";
import { ColumnRepository } from "../repository/ColumnRepository";
import { BoardRepository } from "../repository/BoardRepository";
import { CardRepository } from "../repository/CardRepository";
import AppError from "../errors/AppError";
import {toObjectId} from "../utils/objectId";
import { IColumn } from "../models/Column";

export class ColumnService{

    constructor(
        private columnRepository: ColumnRepository,
        private boardRepository: BoardRepository,
        private cardRepository: CardRepository
    ){}

    async findByBoardId(boardId: string): Promise<IColumn[]>{

        const boardObjectId = toObjectId(boardId, "El id de el tablero es invalido");

        const boardExist = await this.boardRepository.existById(boardObjectId);
        if(!boardExist){
            throw new AppError("El tablero relacionado no existe.",404);
        }

        const columns = await this.columnRepository.findByBoardId(boardObjectId);
        if(columns.length=== 0){
            throw new AppError("Columna/s no encontrada/s",404);
        }
        return columns;

    }

    async create(data: CreateColumnDto): Promise<IColumn>{

        const boardObjectId = toObjectId(data.boardId,"El id del tablero es invalido.");

        const boardExist = await this.boardRepository.existById(boardObjectId);
        if(!boardExist){
            throw new AppError("El tablero relacionado no existe.",404);
        }

        const cardsObjectIds = data.cardsId.map(card => toObjectId(card,"Uno o varios ids de las cards son invalidos."));

        const cardsExist = await this.cardRepository.existManyByIds(cardsObjectIds);
        if(!cardsExist){
            throw new AppError("Una o varias de las cards relaciondas no existen.", 404);
        }

        return this.boardRepository.create({
            name: data.name,
            cardsIds: cardsObjectIds,
            boardId: boardObjectId
        });

    }
}
