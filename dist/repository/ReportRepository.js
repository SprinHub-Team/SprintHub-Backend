"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRepository = void 0;
const mongoose_1 = require("mongoose");
const Board_1 = require("../models/Board");
const Column_1 = require("../models/Column");
const Card_1 = require("../models/Card");
class ReportRepository {
    async getGroupPerformance(groupId) {
        const boards = await Board_1.BoardModel.find({ groupId: new mongoose_1.Types.ObjectId(groupId) }).select('_id').lean().exec();
        const boardIds = boards.map(b => b._id);
        const columns = await Column_1.ColumnModel.find({ boardId: { $in: boardIds } }).select('_id name').lean().exec();
        const columnIds = columns.map(c => c._id);
        // Identificar columnas finales
        const finalColumnIds = columns
            .filter((c) => c.name.toLowerCase().includes('finalizad') || c.name.toLowerCase().includes('hecho') || c.name.toLowerCase().includes('done'))
            .map((c) => c._id);
        const cards = await Card_1.CardModel.find({ columnId: { $in: columnIds } }).lean().exec();
        let created = 0;
        let completed = 0;
        let overdue = 0;
        let pending = 0;
        const now = new Date();
        for (const card of cards) {
            created++;
            const isCompleted = finalColumnIds.some(fid => fid.equals(card.columnId));
            if (isCompleted) {
                completed++;
            }
            else {
                pending++;
                if (card.dueDate && new Date(card.dueDate) < now) {
                    overdue++;
                }
            }
        }
        return {
            created,
            completed,
            overdue,
            pending
        };
    }
    async getUserPerformance(userId, startDate, endDate) {
        const query = { assignedTo: new mongoose_1.Types.ObjectId(userId) };
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = new Date(startDate);
            if (endDate)
                query.createdAt.$lte = new Date(endDate);
        }
        const cards = await Card_1.CardModel.find(query).lean().exec();
        const columnIds = [...new Set(cards.map(c => c.columnId))];
        const columns = await Column_1.ColumnModel.find({ _id: { $in: columnIds } }).select('_id name').lean().exec();
        const finalColumnIds = columns
            .filter((c) => c.name.toLowerCase().includes('finalizad') || c.name.toLowerCase().includes('hecho') || c.name.toLowerCase().includes('done'))
            .map((c) => c._id);
        let created = 0;
        let completed = 0;
        let overdue = 0;
        let pending = 0;
        const now = new Date();
        for (const card of cards) {
            created++;
            const isCompleted = finalColumnIds.some(fid => fid.equals(card.columnId));
            if (isCompleted) {
                completed++;
            }
            else {
                pending++;
                if (card.dueDate && new Date(card.dueDate) < now) {
                    overdue++;
                }
            }
        }
        return {
            userId,
            created,
            completed,
            overdue,
            pending
        };
    }
    async getCompletedActivities(groupId) {
        const boards = await Board_1.BoardModel.find({ groupId: new mongoose_1.Types.ObjectId(groupId) }).select('_id').lean().exec();
        const boardIds = boards.map(b => b._id);
        const columns = await Column_1.ColumnModel.find({ boardId: { $in: boardIds } }).select('_id name').lean().exec();
        const finalColumnIds = columns
            .filter((c) => c.name.toLowerCase().includes('finalizad') || c.name.toLowerCase().includes('hecho') || c.name.toLowerCase().includes('done'))
            .map((c) => c._id);
        const completedCards = await Card_1.CardModel.find({ columnId: { $in: finalColumnIds } }).lean().exec();
        return completedCards;
    }
}
exports.ReportRepository = ReportRepository;
