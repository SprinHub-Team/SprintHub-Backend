import { UploadFileResultDto } from '../utils/FileDto';
import { IBoard } from '../models/Board';
import {CardModel, ICard} from '../models/Card';
import { IColumn } from '../models/Column';
import { Types } from 'mongoose';
import { CardWithDetails } from '../dtos/response/cardResponseDto';
import mongoose from 'mongoose';
import DatabaseError from '../errors/DatabaseError';
import { CreateCardDatabase, RemoveCardFileInput, UpdateCardDatabase } from '../dtos/input/cardInputDto';

type CardWithGroup = {
  columnId: Omit<IColumn, 'boardId'> & {
   boardId: IBoard };
};

export class CardRepository{

  async findById(id: string):Promise<CardWithDetails | null>{

    try{

      const [card] = await CardModel.aggregate([

        {$match: {_id: new mongoose.Types.ObjectId(id)}},

        {
          $lookup:{
            from: 'users',
            localField: 'assignedTo',
            foreignField: '_id',
            as: 'assignedTo'
          }
        },
        {$unwind: { path: '$assignedTo', preserveNullAndEmptyArrays: true }},

        {
          $lookup: {
            from: 'comments',
            let: {idTarjeta: '$id'},
            pipeline:[

              {$match: { $expr:{ $eq: ['$cardId', '$$currentCardId']} } },

              { $sort: { createAt: -1 } },

              {
                $lookup: {
                  from: 'users',
                  localField: 'createdBy',
                  foreignField: '_id',
                  as: 'createdBy'
                }
              },
              {$unwind: '$createdBy'},

              {
                $project:{
                  _id: 1,
                  name: 1,
                  description: 1,
                  createAt: 1,
                  updatedAt: 1,
                  'createdBy._id': 1,
                  'createdBy.name': 1,
                  'createdBy.email': 1,
                  'createdBy.profilePicture': 1
                }
              }

            ],
            as: 'comments'
          }
        },

        {
          $project: {
            _id: 1,
            columnId: 1,
            title: 1,
            description: 1,
            dueDate: 1,
            priority: 1,
            files: 1,
            createdAt: 1,
            updateAt: 1,
            assignedTo:{
              _id: '$assignedTo._id',
              name: '$assignedTo.name',
              email: '$assignedTo.email',
              profilePicture: '$assignedTo.profilePicture'
            },
            comments: 1
          }
        }

      ]);

      return card || null;
    }catch(error: unknown){
      throw new DatabaseError('Error en la busqueda de la tarjeta');
    }

  }

  

  async create(data: CreateCardDatabase ): Promise<CardWithDetails>{

      const newCard = await CardModel.create(data);

      const cardPopulate = await this.findById(newCard._id.toString());
      if(!cardPopulate){
        throw new DatabaseError('Error al crear la tarjeta.');
      }

      return cardPopulate;

  }

  async update(idActualizar: string, data: UpdateCardDatabase ):Promise<CardWithDetails | null>{

      const updateCard = await CardModel.findByIdAndUpdate(idActualizar,data,{
          returnDocument: 'after',
          runValidators: true
      }).exec();
      if(!updateCard){
        throw new DatabaseError('Error al actualizar la tarjeta.');
      }

      return this.findById(updateCard._id.toString());

  }

  async delete(idEliminar: string): Promise<boolean>{
      
      const resultado = await CardModel.findByIdAndDelete(idEliminar).exec();
      return resultado !== null;
      
  }

  async addFile(cardId: string, file: UploadFileResultDto): Promise<CardWithDetails | null> {

    const updateCard =  await CardModel.findByIdAndUpdate(
        cardId,
        { $push: { files: file } },
        { new: true }
    ).lean().exec();
    if(!updateCard){
        throw new DatabaseError('Error al actualizar la tarjeta.');
      }

    return this.findById(updateCard._id.toString());
      
  }

  async removeFile(data: RemoveCardFileInput): Promise<CardWithDetails | null> { 

    const updateCard =  await CardModel.findByIdAndUpdate( 
        data.cardId, 
        { $pull: { files: { path: data.filePath } } }, 
        { new: true } 
    ).lean().exec();
    if(!updateCard){
        throw new DatabaseError('Error al actualizar la tarjeta.');
      }

    return this.findById(updateCard._id.toString());

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

  async getFilesPathByCardId(cardId: string): Promise<string[]> {

    const card = await CardModel.findById(cardId).select('files -_id').lean().exec();

    if (!card || card.files.length === 0) {
        return [];
    }

    const filesPath = card.files.flatMap(file => file.path !== null ? [file.path] : []);

    return filesPath ;

  }


}