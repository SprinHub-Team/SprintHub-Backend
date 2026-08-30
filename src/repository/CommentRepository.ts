import { CommentModel, IComment } from "../models/Comment";

export class CommentRepository {
  async findByCardId(cardId: string): Promise<IComment[]> {
    return CommentModel.find({ cardId: cardId }).exec();
  }

  async create(data: Pick<IComment,'name' | 'description'>&{cardId: string, createdFor: string}) : Promise<IComment> {
    
    const newComment = await CommentModel.create(data);
    return newComment.toObject();

  }

  async update(idActualizar: string, data: Partial<Pick<IComment,'name' | 'description'>>&{createdFor: string}): Promise<IComment | null> {

    const updateComment = await CommentModel.findByIdAndUpdate(idActualizar, data, {
      new: true,
      runValidators: true,
    }).exec();
    return updateComment ? updateComment.toObject() :null;

  }

  async delete(idEliminar: string): Promise<boolean>{
   
    const resultado = await CommentModel.findByIdAndDelete(idEliminar).exec();
    return resultado !== null;
  
  }

  async existManyByIds(commentsIds: string[]): Promise<boolean>{

    const conteo = await CommentModel.countDocuments({ _id: { $in: commentsIds } }).exec();
    return conteo === commentsIds.length;

  }

}
