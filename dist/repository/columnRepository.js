"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnRepository = void 0;
const mongoose_1 = require("mongoose");
const Column_1 = require("../models/Column");
class ColumnRepository {
    async findByBoardId(boardId) {
        return Column_1.ColumnModel.find({ boardId }).lean().exec();
    }
    async findById(id) {
        return Column_1.ColumnModel.findById(id).lean().exec();
    }
    async getCardFilesPathByBoardId(boardId) {
        const results = await Column_1.ColumnModel.aggregate([
            {
                $match: {
                    boardId: new mongoose_1.Types.ObjectId(boardId)
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
        if (!results || results.length === 0)
            return [];
        const allPaths = results.flatMap(r => r.paths);
        return [...new Set(allPaths)];
    }
    async getColumnContext(id) {
        const resultado = await Column_1.ColumnModel.findById(id)
            .populate({
            path: 'boardId',
            select: 'groupId _id'
        }).lean().exec();
        if (!resultado?.boardId) {
            return null;
        }
        const groupId = resultado?.boardId?.groupId.toString();
        const boardId = resultado?.boardId?._id.toString();
        return { groupId, boardId };
    }
    async create(data) {
        const newColumn = await Column_1.ColumnModel.create(data);
        return newColumn.toObject();
    }
    async update(idActualizar, data) {
        const updateColumn = await Column_1.ColumnModel.findByIdAndUpdate(idActualizar, data, {
            returnDocument: 'after',
            runValidators: true,
        }).exec();
        return updateColumn ? updateColumn.toObject() : null;
    }
    async delete(idEliminar) {
        const resultado = await Column_1.ColumnModel.findByIdAndDelete(idEliminar).exec();
        return resultado !== null;
    }
    async existManyByIds(boardsIds) {
        const conteo = await Column_1.ColumnModel.countDocuments({ _id: { $in: boardsIds } }).exec();
        return conteo === boardsIds.length;
    }
    async existById(id) {
        const existe = await Column_1.ColumnModel.exists({ _id: id }).exec();
        return existe !== null;
    }
}
exports.ColumnRepository = ColumnRepository;
