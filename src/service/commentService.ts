import { CreateCommentDto, UpdateCommentDto } from '../dtos/CommentDto';
import AppError from '../errors/AppError';
import ValidationError from '../errors/ValidationError';
import { IComment } from '../models/Comment';
import { CardRepository } from '../repository/cardRepository';
import { CommentRepository } from '../repository/commentRepository';
import { GroupRepository } from '../repository/groupRepository';
import { UserRepository } from '../repository/userRepository';

export class CommentService{

    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly cardRepository: CardRepository,
        private readonly userRepository: UserRepository,
        private readonly groupRepository: GroupRepository
    ){}

    async findByCardId(cardId: string, userId: string) : Promise<IComment[]>{

        const cardContext = await this.cardRepository.getCardContext(cardId);
        if(!cardContext){
            throw new AppError('La tarjeta relacionada no existe', 404);
        }
        
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          cardContext.groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción', 403);
        }

        const comments = await this.commentRepository.findByCardId(cardId);
        return comments;

    }

    async getCommentWhitDetails(commentId: string, userId: string){

        const commentContext = await this.commentRepository.getCommentContext(commentId);
        if(!commentContext){
            throw new AppError('El comentario que intenta obtener no existe', 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        commentContext.groupId,
        userId,
        ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción', 403);
        }

        const comment = await this.commentRepository.findById(commentId);
        if(!comment){
            throw new AppError('El comentario buscado no existe.', 404);
        }

        const createFor = await this.userRepository.findById(comment.createdBy.toString());

        return {...comment, createFor};

    }

    async create(data: CreateCommentDto, userId: string): Promise<{comment: IComment}&{boardId: string}>{

        const cardContext = await this.cardRepository.getCardContext(data.cardId);
        if(!cardContext){
            throw new ValidationError('La tarjeta relacionada no existe');
        }
        
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          cardContext.groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        }

        const comment = await this.commentRepository.create({...data, createdBy: userId});
        
        return {comment, boardId: cardContext.boardId}

    }

    async update(id: string, data: UpdateCommentDto, userId: string): Promise<{comment: IComment}&{boardId: string}>{

        const commentContext = await this.commentRepository.getCommentContext(id);
        if(!commentContext){
            throw new ValidationError('El comentario que intenta actualizar no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          commentContext.groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        }

        const comment = await this.commentRepository.update(id, data);

        if(!comment){
            throw new ValidationError('El comentario no se ha podido actualizar.')
        }

        return {comment, boardId: commentContext.boardId};

    }

    async delete(id: string, userId: string): Promise<{ boardId: string; }>{

        const commentContext = await this.commentRepository.getCommentContext(id);
        if(!commentContext){
            throw new ValidationError('El comentario que intenta eliminar no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          commentContext.groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        }

        const eliminado = await this.commentRepository.delete(id);
        if(!eliminado){
            throw new ValidationError('El comentario que se intenta eliminar no existe');
        }

        return {boardId: commentContext.boardId};

    }

}