import { CreateCardDto, UpdateCardDto } from "../dtos/CardDto";
import { CardRepository } from "../repository/CardRepository";
import { ColumnRepository } from "../repository/ColumnRepository"; 
import AppError from "../errors/AppError";
import { toObjectId, toObjectIds } from "../utils/objectId";
import { ICard } from "../models/Card";

export class CardService{

    constructor(
        private cardRepository: CardRepository,
        private columnRepository: ColumnRepository
    ){}

    async findByColumnId(columnId: string): Promise<ICard[]>{

        const columnObjectId = toObjectId(columnId,"El id de la columna es invalido");

        const columnExist = await this.columnRepository.existById(columnObjectId);
        if(!columnExist){
            throw new AppError("La columna relacionada no existe", 404);
        } 

        const cards = await this.cardRepository.findByColumnId(columnObjectId);

        if(cards.length === 0){
            throw new AppError("Card/s no encontrada/s",404);
        }
        return cards;

    }

    async create(data: CreateCardDto): Promise<ICard>{

        const columnObjectId = toObjectId(data.columnId, "El id de la columna es invalido");

        const columnExist = await this.columnRepository.existById(columnObjectId);
        if(!columnExist){
            throw new AppError("La columna relacionada no existe", 404);
        } 
        
        const assignedToObjectId = toObjectIds(data.assignedTo, "El id de la persona asignada es invalido");
        const boardObjectId = toObjectId(data.boardId, "El id del tablero es invalido");

        return this.cardRepository.create({
            title: data.title,
            description: data.description,
            boardId: boardObjectId,
            columnId: columnObjectId,
            position: data.position,
            assignedTo: assignedToObjectId
        }); 

    }

    async update(id: string, data: UpdateCardDto): Promise<ICard | null>{

        const cardObjectId = toObjectId(id, "El id de la card es invalido");

        const cardExist = await this.cardRepository.existById(cardObjectId);
        if(!cardExist){
            throw new AppError("La tarjeta que se intenta actualizar no existe", 404);
        }

        const updates: any = {
            title: data.title,
            description: data.description,
            position: data.position
        };

        if (data.assignedTo) {
            updates.assignedTo = toObjectIds(data.assignedTo, "El id de la persona asignada es invalido");
        }
        if (data.boardId) {
            updates.boardId = toObjectId(data.boardId, "El id del tablero es invalido");
        }
        if (data.columnId) {
            updates.columnId = toObjectId(data.columnId, "El id de la columna es invalido");
        }

        return this.cardRepository.update(cardObjectId, updates);

    }

    async delete(id: string): Promise<boolean>{
        
        const cardObjectId = toObjectId(id, "El id de la card es invalido");
        return this.cardRepository.delete(cardObjectId);

    }
}