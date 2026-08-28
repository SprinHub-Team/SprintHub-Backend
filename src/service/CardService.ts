import { CreateCardDto, UpdateCardDto } from "../dtos/CardDto";
import { CardRepository } from "../repository/CardRepository";
import { ColumnRepository } from "../repository/ColumnRepository"; 
import AppError from "../errors/AppError";
import { toObjectId } from "../utils/objectId";
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
        
        const assignedToObjectId = toObjectId(data.assignedTo, "El id de la persona asignada es invalido");

        //FALTA LA CREACION DE USUARIO REPOSITORI PARA VALIDACION DE PERSONA ASIGNADA Y 
        //LA CREACION DE LIST REPOSITORY PARA VALIDACION DE  LISTA DE CARD

        return this.cardRepository.create({
            title: data.title,
            description: data.description,
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

        const assignedToObjectId = toObjectId(data.assignedTo, "El id de la persona asignada es invalido");

        //FALTA LA CREACION DE USUARIO REPOSITORI PARA VALIDACION DE PERSONA ASIGNADA Y 
        //LA CREACION DE LIST REPOSITORY PARA VALIDACION DE  LISTA DE CARD

        return this.cardRepository.update(cardObjectId,{
            title: data.title,
            description: data.description,
            position: data.position,
            assignedTo: assignedToObjectId
        });

    }

    async delete(id: string): Promise<boolean>{
        
        const cardObjectId = toObjectId(id, "El id de la card es invalido");
        return this.cardRepository.delete(cardObjectId);

    }
}