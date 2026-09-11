import { IBoard } from "../models/Board";
import { ICard } from "../models/Card";
import { IColumn } from "../models/Column";
import { CommentModel, IComment } from "../models/Comment";

type CommentWithGroup = {
  cardId: Omit<ICard, 'columnId'> & {
    columnId: Omit<IColumn, 'boardId'> & {
      boardId: Pick<IBoard, 'groupId' | '_id'>
    }
  }
};

export class CommentRepository {
  async findByCardId(cardId: string): Promise<IComment[]> {
    return CommentModel.find({ cardId }).lean().exec();
  }

  async getCommentContext(id: string): Promise<{ groupId: string; boardId: string; } | null> {
    const resultado = await CommentModel.findById(id)
      .populate<CommentWithGroup>({
        path: "cardId",
        select: "columnId",
        populate: {
          path: "columnId",
          select: "boardId",
          populate: {
          path: "boardId",
          select: "groupId _id",
        }
        } 
      }).lean().exec();

      if(!resultado?.cardId?.columnId?.boardId){
        return null;
      }

      const groupId = resultado?.cardId?.columnId.boardId.groupId.toString();
      const boardId = resultado?.cardId?.columnId.boardId._id.toString();

      return {groupId, boardId};
  }

  async existById(id: string) {
    const existe = await CommentModel.exists({ _id: id }).exec();
    return existe !== null;
  }

  async findById(commentId: string): Promise<IComment | null> {
    return CommentModel.findById(commentId).lean().exec();
  }

  async create(
    data: Pick<IComment, "name" | "description"> & {
      cardId: string;
      createdBy: string;
    },
  ): Promise<IComment> {
    const newComment = await CommentModel.create(data);
    return newComment.toObject();
  }

  async update(
    idActualizar: string,
    data: Partial<Pick<IComment, "name" | "description">>,
  ): Promise<IComment | null> {
    const updateComment = await CommentModel.findByIdAndUpdate(
      idActualizar,
      data,
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).exec();
    return updateComment ? updateComment.toObject() : null;
  }

  async delete(idEliminar: string): Promise<boolean> {
    const resultado = await CommentModel.findByIdAndDelete(idEliminar).exec();
    return resultado !== null;
  }

  async existManyByIds(commentsIds: string[]): Promise<boolean> {
    const conteo = await CommentModel.countDocuments({
      _id: { $in: commentsIds },
    }).exec();
    return conteo === commentsIds.length;
  }
}
