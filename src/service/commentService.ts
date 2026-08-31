import { CreateCommentDto, UpdateCommentDto } from "../dtos/CommentDto";
import AppError from "../errors/AppError";
import { IComment } from "../models/Comment";
import { CardRepository } from "../repository/cardRepository";
import { CommentRepository } from "../repository/commentRepository";
import { UserRepository } from "../repository/userRepository";

export class CommentService{

    constructor(
        private commentRepository: CommentRepository,
        private cardRepository: CardRepository,
        private userRepository: UserRepository
    ){}

    async findByCardId(cardId: string) : Promise<IComment[]>{

        const cardExist = await this.cardRepository.existById(cardId);
        if(!cardExist){
            throw new AppError("La card relacionada no existe.", 404);
        }

        const comments = await this.commentRepository.findByCardId(cardId);
        return comments;

    }

    async getCommentWhitDetails(commentId: string){

        const comment = await this.commentRepository.findById(commentId);
        if(!comment){
            throw new AppError("El comentario buscado no existe.", 404);
        }

        const createFor = await this.userRepository.findById(comment.createdFor.toString());

        return {...comment, createFor};

    }

    async create(data: CreateCommentDto): Promise<IComment>{

        const createdForExist = await this.userRepository.existById(data.createdFor);
        if(!createdForExist){
            throw new AppError("El usuario relacionado no existe", 404);
        }

        const cardExist = await this.cardRepository.existById(data.cardId);
        if(!cardExist){
            throw new AppError("La tarjeta relacionada no existe.", 404);
        }

        return this.commentRepository.create(data);

    }

    async update(id: string, data: UpdateCommentDto): Promise<IComment | null>{

        const commentExist = await this.commentRepository.existById(id);
        if(commentExist){
            throw new AppError("El cometario que se intenta actualizar no existe", 404);
        }

        return await this.commentRepository.update(id, data);

    }

    async delete(id: string): Promise<void>{

        const eliminado = await this.commentRepository.delete(id);
        if(!eliminado){
            throw new AppError("El comentario que se intenta eliminar no existe", 404);
        }

    }

}