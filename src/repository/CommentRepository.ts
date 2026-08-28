import { CommentModel, IComment } from "../models/Comment";
import mongoose from "mongoose";

export class CommentRepository {
  async findByCardId(cardId: mongoose.Types.ObjectId): Promise<IComment[]> {
    return CommentModel.find({ cardId: cardId }).exec();
  }

  async create(data: Omit<IComment,'_id' | 'createdAt' | 'updateAt'>) : Promise<IComment> {
    
    const newComment = await CommentModel.create(data);
    return newComment.toObject();

  }

  async update(
    idActualizar: mongoose.Types.ObjectId,
    data: Partial<Omit<IComment,'_id' | 'createdAt' | 'updateAt'>>
  ): Promise<IComment | null> {

    const updateComment = await CommentModel.findByIdAndUpdate(idActualizar, data, {
      new: true,
      runValidators: true,
    }).exec();
    return updateComment ? updateComment.toObject() :null;

  }

  async delete(idEliminar: mongoose.Types.ObjectId): Promise<boolean>{
   
    const resultado = await CommentModel.findByIdAndDelete(idEliminar).exec();
    return resultado !== null;
  
  }
}
