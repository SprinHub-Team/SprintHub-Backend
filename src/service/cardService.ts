import { CardDetailsResponse, CardResponse } from '../dtos/response/cardResponseDto';
import { CreateCardInput, RemoveCardFileInput, UpdateCardInput } from '../dtos/input/cardInputDto';
import { CommentRepository } from '../repository/commentRepository';
import SupabaseStorageService from './storage/supabaseStorageService';
import { UploadFileInputRequest } from '../utils/FileDto';
import { ColumnRepository } from '../repository/columnRepository';
import { GroupRepository } from '../repository/groupRepository';
import { CardRepository } from '../repository/cardRepository';
import { UserRepository} from '../repository/userRepository';
import ValidationError from '../errors/ValidationError';
import { CardMapper } from '../mappers/cardMapper';
import AppError from '../errors/AppError';



export class CardService{

    constructor(
        private readonly cardRepository: CardRepository,
        private readonly columnRepository: ColumnRepository,
        private readonly userRepository: UserRepository,
        private readonly commentRepository: CommentRepository,
        private readonly groupRepository: GroupRepository,
        private readonly supabaseStorageService: SupabaseStorageService,
    ){}

    async findByColumnId(columnId: string, userId: string): Promise<CardResponse[]>{

        const columnContext = await this.columnRepository.getColumnContext(columnId);
        if(!columnContext){
            throw new AppError('la columna relacionada no existe', 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          columnContext.groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción o la columna no existe', 403);
        }

        const cards = await this.cardRepository.findByColumnId(columnId);
        return cards.map(card => CardMapper.toResponse(card));
    }

    async getCardWhitDetails(cardId: string, userId: string): Promise<CardDetailsResponse> {

        const cardContext = await this.cardRepository.getCardContext(cardId);
        if(!cardContext){
            throw new AppError('La card buscada no existe.', 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          cardContext.groupId,
          userId,
          ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new AppError('El usuario no tiene permiso para realizar esta acción', 403);
        }

        const card = await this.cardRepository.findById(cardId);
        if(!card){
        throw new AppError('La card buscada no existe.', 404);
        }
        
        const comments = await this.commentRepository.findByCardId(cardId);

        let assignedTo = null;

        if(card.assignedTo !== undefined && card.assignedTo !== null){
        assignedTo = await this.userRepository.findById(card.assignedTo.toString());
        }

        return CardMapper.toDetailsResponse({...card, comments, assignedTo});

    }

    async create(data: CreateCardInput, userId: string): Promise<{card: CardResponse, boardId: string}>{

        const columnContext = await this.columnRepository.getColumnContext(data.columnId);
        if(!columnContext){
            throw new ValidationError('la columna relacionada no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        columnContext.groupId,
        userId,
        ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        }

        const card = await this.cardRepository.create({
            title: data.title,
            description: data.description,
            columnId: data.columnId,
            assignedTo: data.assignedTo,
            priority: data.priority
        }); 

        return {card: CardMapper.toResponse(card), boardId: columnContext.boardId}
    }

    async update(data: UpdateCardInput, userId: string): Promise<{card: CardResponse, boardId: string}>{

        const cardContext = await this.cardRepository.getCardContext(data.cardId);
        if(!cardContext){
            throw new ValidationError('La card que se intenta actualizar no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        cardContext.groupId,
        userId,
        ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        }

        if (data.assignedTo) {
        const asignedToExist = await this.userRepository.existById(data.assignedTo);
        if(!asignedToExist){
                throw new ValidationError('El usuario asignado no existe');
        }
        }

        if (data.columnId) {
            const columnExist = await this.columnRepository.existById(data.columnId);
            if(!columnExist){
                throw new ValidationError('La columna relacionada no existe');
            }
        }
        
        const card = await this.cardRepository.update(data.cardId, {
            description: data.description,
            title: data.title,
            columnId: data.columnId,
            assignedTo: data.assignedTo,
            priority: data.priority,
        });

        if(!card){
            throw new ValidationError('No se ha podido actualizar la card.')
        }

        return{card: CardMapper.toResponse(card), boardId: cardContext.boardId};
    }

    async delete(id: string, userId: string): Promise<string>{

        const cardContext = await this.cardRepository.getCardContext(id);
        if(!cardContext){
            throw new ValidationError('La card que se intenta eliminar no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        cardContext.groupId,
        userId,
        ['admin'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        }
        
        const filesPath = await this.cardRepository.getFilesPathByCardId(id);

        const eliminado = await this.cardRepository.delete(id);

        if(!eliminado){
            throw new ValidationError('La tarjeta que se intenta elminar no existe');
        }

        if(filesPath.length > 0){

        this.supabaseStorageService.deleteMany(filesPath);

        }

        return cardContext.boardId;

    }

    async addFile(cardId: string, fileData: UploadFileInputRequest, userId: string): Promise<{card: CardResponse, boardId: string}> {
        
        const cardContext = await this.cardRepository.getCardContext(cardId);
        if(!cardContext){
            throw new ValidationError('La card a la que se intenta adjuntar un archivo no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        cardContext.groupId,
        userId,
        ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        }

        const file = await this.supabaseStorageService.upload({...fileData, path: 'CardsFiles'});
        const card = await this.cardRepository.addFile(cardId, file);
        if(!card){

            this.supabaseStorageService.delete(file.path);
            throw new ValidationError('No se ha podido subir el archivo.')

        }

        return {card: CardMapper.toResponse(card), boardId: cardContext.boardId}
    }

    async removeFile(data: RemoveCardFileInput, userId: string): Promise<{card: CardResponse, boardId: string}> {

        const cardContext = await this.cardRepository.getCardContext(data.cardId);
        if(!cardContext){
            throw new ValidationError('La card a la que se eliminar un archivo no existe');
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        cardContext.groupId,
        userId,
        ['admin', 'collaborator'],
        );

        if(!hasPermission){
            throw new ValidationError('El usuario no tiene permiso para realizar esta acción');
        }
        
        const card = await this.cardRepository.removeFile(data);
        if(!card){
            throw new ValidationError('No se ha podido eliminar el archivo.')
        }

        this.supabaseStorageService.delete(data.filePath);

        return {card: CardMapper.toResponse(card), boardId: cardContext.boardId}
    }
}