import { CreateCommentInput, UpdateCommentInput } from '../dtos/input/commentInputDto';
import { CommentDetailsResponse, CommentResponse } from '../dtos/response/commentResponseDto';
import AppError from '../errors/AppError';
import ValidationError from '../errors/ValidationError';
import { CommentMapper } from '../mappers/commentMapper';
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

    async findByCardId(cardId: string, userId: string) : Promise<CommentResponse[]>{

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
        
        return comments.map(comment => CommentMapper.toResponse(comment));

    }

    async getCommentWhitDetails(commentId: string, userId: string): Promise<CommentDetailsResponse> {

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

        const createdBy = await this.userRepository.findById(comment.createdBy.toString());

        if(!createdBy){
            throw new ValidationError('El usuario relacionado no existe');
        }

        return CommentMapper.toDetailsResponse({...comment, createdBy});

    }

    async create(data: CreateCommentInput, userId: string): Promise<{comment: CommentResponse}&{boardId: string}>{

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
        
        return {comment: CommentMapper.toResponse(comment), boardId: cardContext.boardId}

    }

    async update(data: UpdateCommentInput, userId: string): Promise<{comment: CommentResponse}&{boardId: string}>{

        const commentContext = await this.commentRepository.getCommentContext(data.commentId);
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

        const comment = await this.commentRepository.update(data.commentId, data);

        if(!comment){
            throw new ValidationError('El comentario no se ha podido actualizar.')
        }

        return {comment: CommentMapper.toResponse(comment), boardId: commentContext.boardId};

    }

    async delete(id: string, userId: string): Promise<string>{

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

        return commentContext.boardId;

    }

}