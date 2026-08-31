import { CardSchemaoutId } from "../dtos/CardDto";
import { CardRepository } from "../repository/CardRepository";
import { ColumnRepository } from "../repository/ColumnRepository";
import { UserRepository} from "../repository/UserRepository";
import AppError from "../errors/AppError";
import { ICard } from "../models/Card";
import { CommentRepository } from "../repository/CommentRepository";


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

    async findByBoardId(boardId: string): Promise<ICard[]> {
        const columns = await this.columnRepository.findByBoardId(boardId);
        const columnIds = columns.map(c => c._id.toString());
        return this.cardRepository.findByColumnIds(columnIds);
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

        if (data.assignedTo) {
            const asignedToExist = await this.userRepository.existById(data.assignedTo);
            if(!asignedToExist){
                throw new AppError("El usuario asignado no existe", 404);
            }
        }

        return this.cardRepository.create({
            title: data.title,
            description: data.description,
            columnId: data.columnId,
            position: data.position ?? 0,
            assignedTo: data.assignedTo,
            priority: data.priority as any,
            tasks: data.tasks as any
        }); 
    }

    async update(id: string, data: Partial<CardSchemaoutId>): Promise<ICard | null>{
        const cardExist = await this.cardRepository.existById(id);
        if(!cardExist){
            throw new AppError("La tarjeta que se intenta actualizar no existe", 404);
        }

        if (data.assignedTo) {
            const asignedToExist = await this.userRepository.existById(data.assignedTo);
            if(!asignedToExist){
                throw new AppError("El usuario asignado no existe", 404);
            }
        }

        if (data.columnId) {
            const columnExist = await this.columnRepository.existById(data.columnId);
            if(!columnExist){
                throw new AppError("La columna relacionada no existe", 404);
            }
        }
        
        return this.cardRepository.update(id, {
            description: data.description,
            title: data.title,
            position: data.position,
            columnId: data.columnId,
            assignedTo: data.assignedTo,
            priority: data.priority as any,
            tasks: data.tasks as any
        });
    }

    async delete(id: string): Promise<void>{
        
        const eliminado = await this.cardRepository.delete(id);
        if(!eliminado){
            throw new AppError("La tarjeta que se intenta elminar no existe", 404);
        }

    }

}