import { CardSchemaoutId } from "../dtos/CardDto";
import { CardRepository } from "../repository/cardRepository";
import { ColumnRepository } from "../repository/columnRepository";
import { UserRepository} from "../repository/userRepository";
import AppError from "../errors/AppError";
import { ICard } from "../models/Card";
import { CommentRepository } from "../repository/commentRepository";


export class CardService{

    constructor(
        private cardRepository: CardRepository,
        private columnRepository: ColumnRepository,
        private userRepository: UserRepository,
        private commentRepository: CommentRepository
    ){}

    async findByColumnId(columnId: string): Promise<ICard[]>{

        const columnExist = await this.columnRepository.existById(columnId);
        if(!columnExist){
            throw new AppError("La columna relacionada no existe", 404);
        } 

        const cards = await this.cardRepository.findByColumnId(columnId);
        return cards;

    }

    async getCardWhitDetails(cardId: string){

        const card = await this.cardRepository.findById(cardId);
        if(!card){
        throw new AppError("El tablero buscado no existe.", 404);
        }
        
        const comments = await this.commentRepository.findByCardId(cardId);

        let assignedTo = null;

        if(card.assignedTo !== undefined && card.assignedTo !== null){
        assignedTo = await this.userRepository.findById(card.assignedTo.toString());
        }


        return {...card, comments, assignedTo};

    }

    async create(data: CardSchemaoutId): Promise<ICard>{

        const columnExist = await this.columnRepository.existById(data.columnId);
        if(!columnExist){
            throw new AppError("La columna relacionada no existe", 404);
        }

        const asignedToExist = this.userRepository.existById(data.assignedTo);
        if(!asignedToExist){
            throw new AppError("El usuario asignado no existe", 404);
        }

        return this.cardRepository.create({
            title: data.title,
            description: data.description,
            columnId: data.columnId,
            position: data.position,
            assignedTo: data.assignedTo
        }); 

    }

    async update(id: string, data: CardSchemaoutId): Promise<ICard | null>{

        const cardExist = await this.cardRepository.existById(id);
        if(!cardExist){
            throw new AppError("La tarjeta que se intenta actualizar no existe", 404);
        }

        const asignedToExist = await this.userRepository.existById(data.assignedTo);
        if(!asignedToExist){
            throw new AppError("El usuario asignado no existe", 404);
        }

        const columnExist = await this.columnRepository.existById(data.columnId);
        if(!columnExist){
            throw new AppError("La columna relacionada no existe", 404);
        }
        
        return this.cardRepository.update(id,{
            description: data.description,
            title: data.title,
            position: data.position,
            columnId: data.columnId,
            assignedTo: data.assignedTo
        });

    }

    async delete(id: string): Promise<void>{
        
        const eliminado = await this.cardRepository.delete(id);
        if(!eliminado){
            throw new AppError("La tarjeta que se intenta elminar no existe", 404);
        }

    }

}