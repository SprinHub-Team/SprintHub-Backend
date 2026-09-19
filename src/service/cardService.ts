import { CreateCardDto, UpdateCardDto } from "../dtos/CardDto";
import { CardRepository } from "../repository/cardRepository";
import { ColumnRepository } from "../repository/columnRepository";
import { UserRepository} from "../repository/userRepository";
import AppError from "../errors/AppError";
import { ICard } from "../models/Card";
import { CommentRepository } from "../repository/commentRepository";
import { GroupRepository } from "../repository/groupRepository";


export class CardService{

    constructor(
        private readonly cardRepository: CardRepository,
        private readonly columnRepository: ColumnRepository,
        private readonly userRepository: UserRepository,
        private readonly commentRepository: CommentRepository,
        private readonly groupRepository: GroupRepository
    ){}

    async findByColumnId(columnId: string, userId: string): Promise<ICard[]>{

        const columnContext = await this.columnRepository.getColumnContext(columnId);
        if(!columnContext){
            throw new AppError("la columna relacionada no existe", 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          columnContext.groupId,
          userId,
          ["admin", "collaborator"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción o la columna no existe", 403);
        }

        const cards = await this.cardRepository.findByColumnId(columnId);
        return cards;
    }

    async getCardWhitDetails(cardId: string, userId: string){

        const cardContext = await this.cardRepository.getCardContext(cardId);
        if(!cardContext){
            throw new AppError("La card buscada no existe.", 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
          cardContext.groupId,
          userId,
          ["admin", "collaborator"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
        }

        const card = await this.cardRepository.findById(cardId);
        if(!card){
        throw new AppError("La card buscada no existe.", 404);
        }
        
        const comments = await this.commentRepository.findByCardId(cardId);

        let assignedTo = null;

        if(card.assignedTo !== undefined && card.assignedTo !== null){
        assignedTo = await this.userRepository.findById(card.assignedTo.toString());
        }


        return {...card, comments, assignedTo};

    }

    async create(data: CreateCardDto, userId: string): Promise<{card: ICard} & {boardId: string}>{

        const columnContext = await this.columnRepository.getColumnContext(data.columnId);
        if(!columnContext){
            throw new AppError("la columna relacionada no existe", 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        columnContext.groupId,
        userId,
        ["admin", "collaborator"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
        }

        const card = await this.cardRepository.create({
            title: data.title,
            description: data.description,
            columnId: data.columnId,
            assignedTo: data.assignedTo,
            priority: data.priority
        }); 

        return {card, boardId: columnContext.boardId}
    }

    async update(id: string, data: UpdateCardDto, userId: string): Promise<{card: ICard | null} & {boardId: string}>{

        const cardContext = await this.cardRepository.getCardContext(id);
        if(!cardContext){
            throw new AppError("La card que se intenta actualizar no existe", 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        cardContext.groupId,
        userId,
        ["admin", "collaborator"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
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
        
        const card = await this.cardRepository.update(id, {
            description: data.description,
            title: data.title,
            columnId: data.columnId,
            assignedTo: data.assignedTo,
            priority: data.priority,
        });

        return{card, boardId: cardContext.boardId};
    }

    async delete(id: string, userId: string): Promise<{boardId: string;}>{

        const cardContext = await this.cardRepository.getCardContext(id);
        if(!cardContext){
            throw new AppError("La card que se intenta eliminar no existe", 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        cardContext.groupId,
        userId,
        ["admin"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
        }
        
        const eliminado = await this.cardRepository.delete(id);
        if(!eliminado){
            throw new AppError("La tarjeta que se intenta elminar no existe", 404);
        }

        return {boardId: cardContext.boardId};

    }

    async addAttachment(cardId: string, fileData: { fileName: string; fileUrl: string; uploadedBy: string }, userId: string) {
        
        const cardContext = await this.cardRepository.getCardContext(cardId);
        if(!cardContext){
            throw new AppError("La card a la que se intenta adjuntar un archivo no existe", 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        cardContext.groupId,
        userId,
        ["admin", "collaborator"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
        }
        
        return await this.cardRepository.addAttachment(cardId, fileData);
    }

    async removeAttachment(cardId: string, attachmentId: string, userId: string) {
        const cardContext = await this.cardRepository.getCardContext(cardId);
        if(!cardContext){
            throw new AppError("La card a la que se eliminar un archivo no existe", 404);
        }

        const hasPermission = await this.groupRepository.isMemberAndRoleValid(
        cardContext.groupId,
        userId,
        ["admin", "collaborator"],
        );

        if(!hasPermission){
            throw new AppError("El usuario no tiene permiso para realizar esta acción", 403);
        }

        return await this.cardRepository.removeAttachment(cardId, attachmentId);
    }
}