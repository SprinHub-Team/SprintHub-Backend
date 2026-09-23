import { Types } from 'mongoose';
import { BoardModel, IBoard } from '../models/Board';
import { ICard } from '../models/Card';
import { IColumn } from '../models/Column';
import { IComment } from '../models/Comment';

export type BoardWhitDetails = IBoard & {
  columns: (IColumn & {
    cards: (ICard & {
      comments: IComment[];
    })[];
  })[];
};
export class BoardRepository {

  async getBoardWhitDetails(boardId: string): Promise<BoardWhitDetails | null> {

    const boardObjectId = new Types.ObjectId(boardId);

    const resultado = await BoardModel.aggregate<BoardWhitDetails>([
      { $match: { _id: boardObjectId } },

      {
        $lookup: {
          from: 'columns',          
          localField: '_id',
          foreignField: 'boardId',
          as: 'columns',
          
          pipeline: [
            {
              $lookup: {
                from: 'cards',      
                localField: '_id',
                foreignField: 'columnId',
                as: 'cards',
                
                pipeline: [
                  {
                    $lookup: {
                      from: 'comments',    
                      localField: '_id',
                      foreignField: 'cardId',
                      as: 'comments'
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

  async getCardFilesPathByGroupId(groupId: string): Promise<string[]> {
    interface AggregateResult {
      paths: string[];
    }

    const results = await BoardModel.aggregate<AggregateResult>([
      { 
        $match: { groupId: new Types.ObjectId(groupId) } 
      },
      {
        $lookup: {
          from: 'columns',
          localField: '_id',
          foreignField: 'boardId',
          as: 'columns'
        }
      },
      {
        $lookup: {
          from: 'cards',
          let: { columnIds: '$columns._id' },
          pipeline: [
            { 
              $match: { 
                $expr: { $in: ['$columnId', '$$columnIds'] },
                files: { $exists: true, $not: { $size: 0 } }
              } 
            },
            { $unwind: '$files' },
            {
              $match: {
                'files.path': { $ne: null, $exists: true }
              }
            },
            {
              $project: {
                _id: 0,
                path: '$files.path'
              }
            }
          ],
          as: 'cards'
        }
      },
      {
        $project: {
          _id: 0,
          paths: {
            $reduce: {
              input: '$cards.path',
              initialValue: [],
              in: { $setUnion: ['$$value', ['$$this']] }
            }
          }
        }
      }
    ]);

    if (!results || results.length === 0) return [];
    
    const allPaths = results.flatMap(r => r.paths);
    return [...new Set(allPaths)];
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
