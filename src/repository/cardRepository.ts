import { RemoveCardFileInput } from '../dtos/input/cardInputDto';
import { UploadFileResultDto } from '../utils/FileDto';
import { IBoard } from '../models/Board';
import {CardModel, ICard} from '../models/Card';
import { IColumn } from '../models/Column';
import { Types } from 'mongoose';

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

    async getCardFilesPathByColumnId(columnId: string): Promise<string[]> {
    interface AggregateResult {
      paths: string[];
    }

    const results = await CardModel.aggregate<AggregateResult>(
    [
      {
        $match: {
          columnId: new Types.ObjectId(columnId),
          files: { $exists: true, $not: { $size: 0 } }
        }
      },
      {
        $unwind: '$files'
      },
      {
        $match: {
          'files.path': { $ne: null, $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          paths: { $addToSet: '$files.path' }
        }
      },
      {
        $project: {
          _id: 0,
          paths: 1
        }
      }
    ]);

    if (!results || results.length === 0) {
      return [];
    }

    return results[0].paths;
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

async getFilesPathByCardId(cardId: string): Promise<string[]> {

  const card = await CardModel.findById(cardId).select('files -_id').lean().exec();

  if (!card || card.files.length === 0) {
      return [];
   }

   const filesPath = card.files.flatMap(file => file.path !== null ? [file.path] : []);

   return filesPath ;

}


}