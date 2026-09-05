import { Types } from "mongoose";
import { BoardModel } from "../models/Board";
import { ColumnModel } from "../models/Column";
import { CardModel } from "../models/Card";

export class ReportRepository {
  
  async getGroupPerformance(groupId: string) {
    const boards = await BoardModel.find({ groupId: new Types.ObjectId(groupId) }).select('_id').lean().exec();
    const boardIds = boards.map(b => b._id);
    
    const columns = await ColumnModel.find({ boardId: { $in: boardIds } }).select('_id name').lean().exec();
    const columnIds = columns.map(c => c._id);
    
    // Identificar columnas finales
    const finalColumnIds = columns
      .filter((c: any) => c.name.toLowerCase().includes('finalizad') || c.name.toLowerCase().includes('hecho') || c.name.toLowerCase().includes('done'))
      .map((c: any) => c._id);

    const cards = await CardModel.find({ columnId: { $in: columnIds } }).lean().exec();
    
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
      } else {
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
  
  async getUserPerformance(userId: string, startDate?: string, endDate?: string) {
    
    const query: any = { assignedTo: new Types.ObjectId(userId) };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const cards = await CardModel.find(query).lean().exec();
    const columnIds = [...new Set(cards.map(c => c.columnId))];
    const columns = await ColumnModel.find({ _id: { $in: columnIds } }).select('_id name').lean().exec();
    
    const finalColumnIds = columns
      .filter((c: any) => c.name.toLowerCase().includes('finalizad') || c.name.toLowerCase().includes('hecho') || c.name.toLowerCase().includes('done'))
      .map((c: any) => c._id);
      
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
      } else {
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
  
  async getCompletedActivities(groupId: string) {
    const boards = await BoardModel.find({ groupId: new Types.ObjectId(groupId) }).select('_id').lean().exec();
    const boardIds = boards.map(b => b._id);
    
    const columns = await ColumnModel.find({ boardId: { $in: boardIds } }).select('_id name').lean().exec();
    
    const finalColumnIds = columns
      .filter((c: any) => c.name.toLowerCase().includes('finalizad') || c.name.toLowerCase().includes('hecho') || c.name.toLowerCase().includes('done'))
      .map((c: any) => c._id);
      
    const completedCards = await CardModel.find({ columnId: { $in: finalColumnIds } }).lean().exec();
    
    return completedCards;
  }
}
