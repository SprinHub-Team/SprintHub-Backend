import { Types } from 'mongoose';
import { IBoard } from '../models/Board';
import { ColumnModel, IColumn } from '../models/Column';

type ColumnWithGroup = {
boardId: IBoard
}

export class ColumnRepository {

  async findByBoardId(boardId: string): Promise<IColumn[]> {
    return ColumnModel.find({ boardId }).lean().exec();
  }

  async findById(id: string): Promise<IColumn | null> {
    return ColumnModel.findById(id).lean().exec();
  }

  async getCardFilesPathByBoardId(boardId: string): Promise<string[]> {
    interface AggregateResult {
      paths: string[];
    }

    const results = await ColumnModel.aggregate<AggregateResult>([
      {
        $match: {
          boardId: new Types.ObjectId(boardId)
        }
      },
      {
        $lookup: {
          from: 'cards',
          let: { columnId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$columnId', '$$columnId'] },
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


  async getColumnContext(id: string): Promise<{ groupId: string; boardId: string; } | null> {
    
    const resultado = await ColumnModel.findById(id)
    .populate<ColumnWithGroup>({
      path: 'boardId',
      select: 'groupId _id'
    }).lean().exec();

    if (!resultado?.boardId) {
        return null;
    }

    const groupId = resultado?.boardId?.groupId.toString();
    const boardId = resultado?.boardId?._id.toString();

    return {groupId, boardId};
  } 

  async create(data: Pick<IColumn, 'name'>&{boardId: string}): Promise<IColumn> {
    
    const newColumn = await ColumnModel.create(data);
    return newColumn.toObject();
  
  }

  async update(idActualizar: string, data: {name: string | undefined}): Promise<IColumn | null> {

    const updateColumn = await ColumnModel.findByIdAndUpdate(idActualizar, data, {
      returnDocument: 'after',
      runValidators: true,
    }).exec();
    return updateColumn ? updateColumn.toObject() : null;

  }

  async delete(idEliminar: string): Promise<boolean> {
    
    const resultado = await ColumnModel.findByIdAndDelete(idEliminar).exec();
    return resultado !== null;
  
  }

  async existManyByIds(boardsIds: string[]): Promise<boolean>{

    const conteo = await ColumnModel.countDocuments({ _id: { $in: boardsIds } }).exec();
    return conteo === boardsIds.length;

  }

  async existById(id: string): Promise<boolean>{

    const existe = await ColumnModel.exists({_id: id}).exec();
    return existe !== null;

  }

}
