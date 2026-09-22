import { RemoveCardFileInput } from '../dtos/input/cardInputDto';
import { UploadFileResultDto } from '../utils/FileDto';
import { IBoard } from '../models/Board';
import {CardModel, ICard} from '../models/Card';
import { IColumn } from '../models/Column';

type CardWithGroup = {
  columnId: Omit<IColumn, 'boardId'> & {
   boardId: IBoard };
};

export class CardRepository{

    async findByColumnId(columnId: string):Promise<ICard[]>{
        return CardModel.find({ columnId }).lean().exec();
    }

    async findById(id: string):Promise<ICard | null>{
        return CardModel.findById(id).lean().exec();
    }

    async getCardContext(id: string): Promise<{ groupId: string; boardId: string; } | null> {
        
        const resultado = await CardModel.findById(id)
        .populate<CardWithGroup>({
          path: 'columnId',
          select: 'boardId',
          populate:{
          path: 'boardId',
          select: 'groupId _id'
          }
        }).lean().exec();

        if(!resultado?.columnId?.boardId){
            return null;
        }
    
        const groupId = resultado?.columnId?.boardId.groupId.toString();
        const boardId = resultado?.columnId?.boardId._id.toString();

        return {groupId, boardId};
    }


    async create(data: Pick<ICard, 'title' | 'description' | 'dueDate' | 'priority'>&{columnId: string, assignedTo?: string }): Promise<ICard>{
        const newCard = await CardModel.create(data);
        return newCard.toObject();
    }

    async update(idActualizar: string, data: Partial<Pick<ICard,'description' |'title' | 'priority' >>&{columnId?: string, assignedTo?: string }):Promise<ICard | null>{
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

    async addFile(cardId: string, file: UploadFileResultDto): Promise<ICard | null> {

        return CardModel.findByIdAndUpdate(
            cardId,
            { $push: { files: file } },
            { new: true }
        ).lean().exec();
        
    }

async removeFile(data: RemoveCardFileInput): Promise<ICard | null> { 

    return CardModel.findByIdAndUpdate( 
        data.cardId, 
        { $pull: { files: { path: data.filePath } } }, 
        { new: true } 
    ).lean().exec(); 

}

async getFilesByCardId(cardId: string) {
  const card = await CardModel.findById(cardId).select('files -_id').lean().exec();
  return card ? card.files.map(file => file.path) : null;
}

async getFilesByColumnId(columnId: string) {
    const cards = await CardModel.find({ columnId }).select('files -_id').lean().exec();
    return cards ? cards.map(card => card.files).flatMap(files => files.map(file => file.path)) : null;

}

}