import { CreateCommentDto, UpdateCommentDto } from "../dtos/CommentDto";
import AppError from "../errors/AppError";
import { IComment } from "../models/Comment";
import { CardRepository } from "../repository/cardRepository";
import { CommentRepository } from "../repository/commentRepository";
import { GroupRepository } from "../repository/groupRepository";
import { UserRepository } from "../repository/userRepository";

export class CommentService{

    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly cardRepository: CardRepository,
        private readonly userRepository: UserRepository,
        private readonly groupRepository: GroupRepository
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

        const createFor = await this.userRepository.findById(comment.createdBy.toString());

        return {...comment, createFor};

    }

    async create(data: CreateCommentDto, userId: string): Promise<IComment>{

        const groupId = await this.cardRepository.getGroupIdByCardId(data.cardId);
        if(!groupId){
            throw new AppError("La tarjeta relacionada no existe", 404);
        }
        
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ["admin", "collaborator"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
        }

        return this.commentRepository.create({...data, createdBy: userId});

    }

    async update(id: string, data: UpdateCommentDto, userId: string): Promise<IComment | null>{

        const groupId = await this.commentRepository.getGroupIdByCommentId(id);
        if(!groupId){
            throw new AppError("El comentario que intenta actualizar no existe", 404);
        }

         const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ["admin", "collaborator"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
        }

        return await this.commentRepository.update(id, data);

    }

    async delete(id: string, userId: string): Promise<void>{

        const groupId = await this.commentRepository.getGroupIdByCommentId(id);
        if(!groupId){
            throw new AppError("El comentario que intenta actualizar no existe", 404);
        }

         const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          groupId,
          userId,
          ["admin", "collaborator"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
        }

        const eliminado = await this.commentRepository.delete(id);
        if(!eliminado){
            throw new AppError("El comentario que se intenta eliminar no existe", 404);
        }

    }

}