import { CreateCommentInput, UpdateCommentInput } from '../dtos/input/commentInputDto';
import { CommentDetailsResponse } from '../dtos/response/commentResponseDto';
import ValidationError from '../errors/ValidationError';
import { CommentMapper } from '../mappers/commentMapper';
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

    async create(data: CreateCommentInput, userId: string): Promise<{comment: CommentDetailsResponse}&{boardId: string}>{

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

        try{

            const comment = await this.commentRepository.create({...data, createdBy: userId});
            
            return {comment: CommentMapper.toDetailsResponse(comment), boardId: cardContext.boardId}

        }catch(error: unknown){

            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new ValidationError(`No se ha podido crear el comentario ${errorMessage}`);

        }

    }

    async update(data: UpdateCommentInput, userId: string): Promise<{comment: CommentDetailsResponse}&{boardId: string}>{

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

        return {comment: CommentMapper.toDetailsResponse(comment), boardId: commentContext.boardId};

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