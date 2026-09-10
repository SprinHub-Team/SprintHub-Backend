import { IBoard } from "../models/Board";
import {CardModel, ICard} from "../models/Card";
import { IColumn } from "../models/Column";

type CardWithGroup = {
  columnId: Omit<IColumn, "boardId"> & {
   boardId: IBoard };
};

export class CardRepository{

    async findByColumnId(columnId: string):Promise<ICard[]>{
        return CardModel.find({ columnId }).lean().exec();
    }

    async findByColumnIds(columnIds: string[]): Promise<ICard[]> {
        return CardModel.find({ columnId: { $in: columnIds } }).lean().exec();
    }

    async findById(id: string):Promise<ICard | null>{
        return CardModel.findById(id).lean().exec();
    }

    async getGroupIdByCardId(id: string): Promise<string | null> {
        
        const resultado = await CardModel.findById(id)
        .populate<CardWithGroup>({
          path: 'columnId',
          select: 'boardId',
          populate:{
          path: 'boardId',
          select: 'groupId'
          }
        }).lean().exec();
    
        return resultado?.columnId?.boardId.groupId.toString() || null;
    }

    async create(data: Pick<ICard, 'title' | 'description' | 'position' | 'dueDate' | 'priority' | 'tasks'>&{columnId: string, assignedTo?: string }): Promise<ICard>{
        const newCard = await CardModel.create(data);
        return newCard.toObject();
    }

    async update(idActualizar: string, data: Partial<Pick<ICard,'description' |'title' | 'position' | 'priority' | 'tasks'>>&{columnId?: string, assignedTo?: string }):Promise<ICard | null>{
        const updateCard = await CardModel.findByIdAndUpdate(idActualizar,data,{
            returnDocument: 'after',
            runValidators: true
        }).exec();
        return updateCard ? updateCard.toObject(): null;
    }

    async delete(idEliminar: string): Promise<boolean>{
        
        const resultado = await CardModel.findByIdAndDelete(idEliminar).exec();
        return resultado !== null;
        
    }

    async existById(id: string){

        const existe = await CardModel.exists({_id: id}).exec();
        return existe !== null;
    }

    async existManyByIds(ids: string[]): Promise<boolean>{
        const conteo = await CardModel.countDocuments({_id:{$in: ids}}).exec();
        return conteo === ids.length;
    }

    async addAttachment(cardId: string, attachment: { fileName: string; fileUrl: string; uploadedBy: string }): Promise<ICard | null> {
        return CardModel.findByIdAndUpdate(
            cardId,
            { $push: { attachments: attachment } },
            { new: true }
        ).lean().exec();
    }

    async removeAttachment(cardId: string, attachmentId: string): Promise<ICard | null> {
        return CardModel.findByIdAndUpdate(
            cardId,
            { $pull: { attachments: { _id: attachmentId } } },
            { new: true }
        ).lean().exec();
    }
}