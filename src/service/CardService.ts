import { CardSchemaoutId } from "../dtos/CardDto";
import { CardRepository } from "../repository/CardRepository";
import { ColumnRepository } from "../repository/ColumnRepository";
import { CommentRepository } from "../repository/CommentRepository";
import { UserRepository} from "../repository/UserRepository";
import AppError from "../errors/AppError";
import { ICard } from "../models/Card";
import mongoose from "mongoose";


export class CardService{

    constructor(
        private cardRepository: CardRepository,
        private columnRepository: ColumnRepository,
        private commentRepository: CommentRepository,
        private userRepository: UserRepository
    ){}

    async findByColumnId(columnId: string): Promise<ICard[]>{

        const columnExist = await this.columnRepository.existById(columnId);
        if(!columnExist){
            throw new AppError("La columna relacionada no existe", 404);
        } 

        const cards = await this.cardRepository.findByColumnId(columnId);

        if(cards.length === 0){
            throw new AppError("Card/s no encontrada/s",404);
        }
        return cards;

    }

    async create(data: CardSchemaoutId): Promise<ICard>{

        const columnExist = await this.columnRepository.existById(data.columnId);
        if(!columnExist){
            throw new AppError("La columna relacionada no existe", 404);
        }
        
        let commentsIds: string[] = [];
        if(data.commentsIds && data.commentsIds.length > 0){

        commentsIds = data.commentsIds;

        const commentsExist = this.commentRepository.existManyByIds(commentsIds);
        if(!commentsExist){
            new AppError("Uno o varios de los comentarios relacionados no existen", 404);
        }

        }

        const asignedToExist = this.userRepository.existById(data.assignedTo);
        if(!asignedToExist){
            throw new AppError("El usuario asignado no existe", 404);
        }

        return this.cardRepository.create({
            title: data.title,
            description: data.description,
            columnId: data.columnId,
            commentsIds: commentsIds,
            position: data.position,
            assignedTo: data.assignedTo
        }); 

    }

    async update(id: string, data: CardSchemaoutId): Promise<ICard | null>{

        const cardExist = await this.cardRepository.existById(id);
        if(!cardExist){
            throw new AppError("La tarjeta que se intenta actualizar no existe", 404);
        }

        const asignedToExist = this.userRepository.existById(data.assignedTo);
        if(!asignedToExist){
            throw new AppError("El usuario asignado no existe", 404);
        }
        
        let commentsIds: string[] = [];
        if(data.commentsIds && data.commentsIds.length > 0){

        commentsIds = data.commentsIds;

        const commentsExist = this.commentRepository.existManyByIds(commentsIds);
        if(!commentsExist){
            new AppError("Uno o varios de los comentarios relacionados no existen", 404);
        }

        }
        
        return this.cardRepository.update(id,{
            title: data.title,
            description: data.description,
            commentsIds : commentsIds,
            position: data.position,
            assignedTo: data.assignedTo
        });

    }

    // async delete(id: string): Promise<boolean>{
        
    //     await this.commentRepository.deleteManyByCardId(id);

    //     const eliminado = this.cardRepository.delete(id);
    //     if(!eliminado){
    //         throw new AppError("La tarjeta que se intenta elminar no existe", 404);
    //     }

    //     return eliminado;

    // }

    // async deleteManyByColumnId(id: string): Promise<boolean>{

    //     cardsthis.cardRepository.findByColumnId(id);


    // }

}