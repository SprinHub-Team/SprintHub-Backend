import { Types } from 'mongoose';
import { CommentWithDetails } from '../dtos/response/commentResponseDto';
import DatabaseError from '../errors/DatabaseError';
import { CommentModel, IComment } from '../models/Comment';
import { UserReference } from '../dtos/response/userResponseDto';
import { CreateCommentDatabase, UpdateCommentDatabase } from '../dtos/input/commentInputDto';


export class CommentRepository {

  

  async findById(commentId: string): Promise<CommentWithDetails | null> {

    return CommentModel.findById(commentId)
    .populate <{createdBy : UserReference}> ({
            path: 'createdBy',
            select: '_id name email profilePicture' 
          })
    .lean()
    .exec();

  }

  async create(data: CreateCommentDatabase) : Promise<CommentWithDetails> {

    const newComment = (await CommentModel.create(data)).toObject();

    const commentPopulate = await this.findById(newComment._id.toString());
    if(!commentPopulate){
      throw new DatabaseError('No se ha podido crear el commentario.');
    }

    return commentPopulate;

  }

  async update(idActualizar: string, data: UpdateCommentDatabase): Promise<CommentWithDetails | null> {

    const updateComment = await CommentModel.findByIdAndUpdate(
      idActualizar,
      data,
      {
        returnDocument: 'after',
        runValidators: true,
      },
    )
    .populate <{createdBy : UserReference}> ({
            path: 'createdBy',
            select: '_id name email profilePicture' 
    })
    .lean()
    .exec();

    return updateComment ? updateComment : null;

  }

  async delete(idEliminar: string): Promise<boolean> {

    const resultado = await CommentModel.findByIdAndDelete(idEliminar).exec();
    return resultado !== null;

  }

  async getCommentContext(id: string): Promise<{ groupId: string; boardId: string } | null> {
      
    const [resultado] = await CommentModel.aggregate([

      { $match: { _id: new Types.ObjectId(id) } },

      { $lookup: { from: 'cards', localField: 'cardId', foreignField: '_id', as: 'card' } },
      { $unwind: '$card' },

      { $lookup: { from: 'columns', localField: 'card.columnId', foreignField: '_id', as: 'column' } },
      { $unwind: '$column' },

      { $lookup: { from: 'boards', localField: 'column.boardId', foreignField: '_id', as: 'board' } },
      { $unwind: '$board' },

      {
        $project: {
          _id: 0,
          boardId: { $toString: '$board._id' },
          groupId: { $toString: '$board.groupId' }
        }
      }
    ]);

    return resultado || null;

  }

}
