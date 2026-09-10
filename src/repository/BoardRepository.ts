import { Types } from "mongoose";
import { BoardModel, IBoard } from "../models/Board";
import { ICard } from "../models/Card";
import { IColumn } from "../models/Column";
import { IComment } from "../models/Comment";

type BoardAggregateresult = IBoard & {
  columnas: (IColumn & {
    tarjetas: (ICard & {
      comentarios: IComment[];
    })[];
  })[];
};
export class BoardRepository {

   async getBoardWhitDetails(boardId: string): Promise<BoardAggregateresult | null> {

    const boardObjectId = new Types.ObjectId(boardId);

    const resultado = await BoardModel.aggregate<BoardAggregateresult>([
      { $match: { _id: boardObjectId } },

      {
        $lookup: {
          from: "columns",          
          localField: "_id",
          foreignField: "boardId",
          as: "columnas",
          
          pipeline: [
            {
              $lookup: {
                from: "cards",      
                localField: "_id",
                foreignField: "columnId",
                as: "tarjetas",
                
                pipeline: [
                  {
                    $lookup: {
                      from: "comments",    
                      localField: "_id",
                      foreignField: "cardId",
                      as: "comentarios"
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]).exec();

    return resultado[0] || null;
  }

  async findByGroupId(groupId: string): Promise<IBoard[]> {
    return BoardModel.find({ groupId }).lean().exec();
  }

  async findById(id: string): Promise<IBoard | null> {
    return BoardModel.findById(id).lean().exec();
  }

  async getGroupIdByBoardId(id: string): Promise<string | null> {
    const resultado = await BoardModel.findById(id).select('groupId').lean().exec();
    return resultado?.groupId?.toString() || null;
  }

  async create(data: Pick<IBoard,'description' | 'title'>&{groupId: string, ownerId: string}): Promise<IBoard> {
    
    const newBoard = await BoardModel.create(data);
    return newBoard.toObject();

  }

  async update(idActualizar: string, data: Partial<Pick<IBoard, 'description' | 'title'>>): Promise<IBoard | null> {

    const updateBoard = await BoardModel.findByIdAndUpdate(idActualizar, data, {
      returnDocument: 'after',
      runValidators: true,
    }).exec();
    return updateBoard ? updateBoard.toObject() : null;
  
  }

  async delete(idEliminar: string): Promise<boolean> {
   
    const resultado = await BoardModel.findByIdAndDelete(idEliminar).exec();
    return resultado !== null;
  
  }

  async existById(id: string): Promise<boolean> {

    const existe = await BoardModel.exists({_id: id}).exec();
    return existe !== null;

  }
  
}
