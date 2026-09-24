"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardRepository = void 0;
const mongoose_1 = require("mongoose");
const Board_1 = require("../models/Board");
class BoardRepository {
    async getBoardWhitDetails(boardId) {
        const boardObjectId = new mongoose_1.Types.ObjectId(boardId);
        const resultado = await Board_1.BoardModel.aggregate([
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
    async getCardFilesPathByGroupId(groupId) {
        const results = await Board_1.BoardModel.aggregate([
            {
                $match: { groupId: new mongoose_1.Types.ObjectId(groupId) }
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
        if (!results || results.length === 0)
            return [];
        const allPaths = results.flatMap(r => r.paths);
        return [...new Set(allPaths)];
    }
    async findByGroupId(groupId) {
        return Board_1.BoardModel.find({ groupId }).lean().exec();
    }
    async findById(id) {
        return Board_1.BoardModel.findById(id).lean().exec();
    }
    async getGroupIdByBoardId(id) {
        const resultado = await Board_1.BoardModel.findById(id).select('groupId').lean().exec();
        return resultado?.groupId?.toString() || null;
    }
    async create(data) {
        const newBoard = await Board_1.BoardModel.create(data);
        return newBoard.toObject();
    }
    async update(idActualizar, data) {
        const updateBoard = await Board_1.BoardModel.findByIdAndUpdate(idActualizar, data, {
            returnDocument: 'after',
            runValidators: true,
        }).exec();
        return updateBoard ? updateBoard.toObject() : null;
    }
    async delete(idEliminar) {
        const resultado = await Board_1.BoardModel.findByIdAndDelete(idEliminar).exec();
        return resultado !== null;
    }
    async existById(id) {
        const existe = await Board_1.BoardModel.exists({ _id: id }).exec();
        return existe !== null;
    }
}
exports.BoardRepository = BoardRepository;
