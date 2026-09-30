import mongoose, { Types } from 'mongoose';
import { BoardModel, IBoard } from '../models/Board';
import DatabaseError from '../errors/DatabaseError';
import { BoardWhitDetails } from '../dtos/response/boardResponseDto';
import { CreateBoardDatabase, UpdateBoardDatabase } from '../dtos/input/boardInputDto';

export class BoardRepository {

  async findById(id: string): Promise<BoardWhitDetails | null> {
    
      try {
      const [boardDetails] = await BoardModel.aggregate([

        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        },

        {
          $lookup: {
            from: 'columns',
            localField: '_id',
            foreignField: 'boardId',
            pipeline: [
              {

                $lookup: {
                  from: 'cards',
                  localField: '_id',
                  foreignField: 'columnId',
                  pipeline: [
                    {
                      $lookup: {
                        from: 'users',
                        localField: 'assignedTo',
                        foreignField: '_id',
                        as: 'assignedTo'
                      }
                    },
                    { $unwind: { path: '$assignedTo', preserveNullAndEmptyArrays: true } },

                    {
                      $lookup: {
                        from: 'comments',
                        let: { currentCardId: '$_id' },
                        pipeline: [
                          { $match: { $expr: { $eq: ['$cardId', '$$currentCardId'] } } },
                          { $sort: { createdAt: -1 } },
                          {
                            $lookup: {
                              from: 'users',
                              localField: 'createdBy',
                              foreignField: '_id',
                              as: 'createdBy'
                            }
                          },
                          { $unwind: '$createdBy' },

                          {
                            $project: {
                              _id: 1,
                              cardId: 1,
                              name: 1,
                              description: 1,
                              createdAt: 1,
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
                        updatedAt: 1,
                        assignedTo: {
                          _id: '$assignedTo._id',
                          name: '$assignedTo.name',
                          email: '$assignedTo.email',
                          profilePicture: '$assignedTo.profilePicture'
                        },
                        comments: 1
                      }
                    }
                  ],
                  as: 'cards'
                }
              },

              {
                $project: {
                  _id: 1,
                  name: 1,
                  boardId: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  cards: 1
                }
              }
            ],
            as: 'columns'
          }
        },

        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            groupId: 1,
            createdAt: 1,
            updatedAt: 1,
            columns: 1
          }
        }

      ]);

      return boardDetails || null;

    } catch (error: unknown) {
      throw new DatabaseError('Error en la busqueda de el tablero')
    }

  }

  async create(data: CreateBoardDatabase): Promise<BoardWhitDetails> {
    
    const newBoard = await BoardModel.create(data);
    const boardPopulate = await this.findById(newBoard._id.toString());
    if(!boardPopulate){
      throw new DatabaseError('Error al crear el tablero.');
    }

    return boardPopulate;

  }

  async update(idActualizar: string, data: UpdateBoardDatabase): Promise<BoardWhitDetails | null> {

    const updateBoard = await BoardModel.findByIdAndUpdate(idActualizar, data, {
      returnDocument: 'after',
      runValidators: true,
    }).exec();
    if(!updateBoard){
      throw new DatabaseError('Error al actualizar el tablero.');
    }

    return await this.findById(updateBoard._id.toString());
  
  }

  async delete(idEliminar: string): Promise<boolean> {
   
    const resultado = await BoardModel.findByIdAndDelete(idEliminar).exec();
    return resultado !== null;
  
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
  
  async getGroupIdByBoardId(id: string): Promise<string | null> {
    const resultado = await BoardModel.findById(id).select('groupId').lean().exec();
    return resultado?.groupId?.toString() || null;
  }

}
