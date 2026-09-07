import { CommentModel, IComment } from "../models/Comment";

export class CommentRepository {

  async findByCardId(cardId: string): Promise<IComment[]> {
    return CommentModel.find({ cardId }).lean().exec();
  }

  async existById(id: string){

    const existe = await CommentModel.exists({_id: id}).exec();
    return existe !== null;

  }

  async findById(commentId: string): Promise<IComment | null> {
    return CommentModel.findById(commentId).lean().exec();
  }

  async create(data: Pick<IComment,'name' | 'description'>&{cardId: string, createdFor: string}) : Promise<IComment> {
    
    const newComment = await CommentModel.create(data);
    return newComment.toObject();

  }

  async update(idActualizar: string, data: Partial<Pick<IComment,'name' | 'description'>>): Promise<IComment | null> {

    const updateComment = await CommentModel.findByIdAndUpdate(idActualizar, data, {
      returnDocument: 'after',
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
