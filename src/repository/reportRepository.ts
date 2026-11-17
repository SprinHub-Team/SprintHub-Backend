import { Types } from 'mongoose';
import { BoardModel } from '../models/Board';
import { ColumnModel } from '../models/Column';
import { CardModel } from '../models/Card';
import type { CompletedCard, GroupPerformanceResponse, UserPerformanceResponse } from '../dtos/response/reportResponseDto';

type ReportCard = Pick<CompletedCard, 'columnId' | 'assignedTo' | 'dueDate'>;

const emptyPerformance = (): GroupPerformanceResponse => ({ created: 0, completed: 0, overdue: 0, pending: 0 });

function finalColumns(columns: { _id: Types.ObjectId; name: string }[]) {
  return columns.filter(column => {
    const name = column.name.trim().toLowerCase();
    return /finalizad|hecho|done/.test(name) || name === 'listo' || name === 'resuelto';
  }).map(column => column._id);
}

function addCard(counts: GroupPerformanceResponse, completed: boolean, overdue: boolean) {
  counts.created++;
  if (completed) {
    counts.completed++;
  } else {
    counts.pending++;
    if (overdue) counts.overdue++;
  }
}

function summarizeCards(cards: ReportCard[], finishedColumns: Types.ObjectId[]) {
  const finished = new Set(finishedColumns.map(id => id.toString()));
  const now = new Date();
  const totals = emptyPerformance();
  const unassigned = emptyPerformance();
  const byUser = new Map<string, GroupPerformanceResponse>();

  for (const card of cards) {
    const completed = finished.has(card.columnId.toString());
    const overdue = Boolean(card.dueDate && new Date(card.dueDate) < now);
    addCard(totals, completed, overdue);

    if (!card.assignedTo) {
      addCard(unassigned, completed, overdue);
      continue;
    }
    const userId = card.assignedTo.toString();
    const counts = byUser.get(userId) ?? emptyPerformance();
    addCard(counts, completed, overdue);
    byUser.set(userId, counts);
  }

  return { totals, unassigned, byUser };
}

export class ReportRepository {
  private async getGroupColumns(groupId: string) {
    const boards = await BoardModel.find({ groupId }).select('_id').lean().exec();
    return ColumnModel.find({ boardId: { $in: boards.map(board => board._id) } })
      .select('_id name').lean().exec();
  }

  async getGroupPerformance(groupId: string): Promise<GroupPerformanceResponse> {
    return (await this.getGroupBreakdown(groupId)).totals;
  }

  async getGroupBreakdown(groupId: string) {
    const columns = await this.getGroupColumns(groupId);
    const cards = await CardModel.find({ columnId: { $in: columns.map(column => column._id) } })
      .select('columnId assignedTo dueDate').lean().exec();
    return summarizeCards(cards, finalColumns(columns));
  }

  async getUserPerformance(userId: string, startDate?: string, endDate?: string): Promise<UserPerformanceResponse> {
    const cards = await CardModel.find({
      assignedTo: new Types.ObjectId(userId),
      ...(startDate || endDate ? {
        createdAt: {
          ...(startDate ? { $gte: new Date(startDate) } : {}),
          ...(endDate ? { $lte: new Date(endDate) } : {}),
        },
      } : {}),
    }).select('columnId assignedTo dueDate').lean().exec();
    const columnIds = [...new Set(cards.map(card => card.columnId.toString()))];
    const columns = await ColumnModel.find({ _id: { $in: columnIds } }).select('_id name').lean().exec();
    return { userId, ...summarizeCards(cards, finalColumns(columns)).totals };
  }

  async getCompletedActivities(groupId: string): Promise<CompletedCard[]> {
    const columns = await this.getGroupColumns(groupId);
    return CardModel.find({ columnId: { $in: finalColumns(columns) } })
      .sort({ updatedAt: -1, _id: -1 }).lean().exec();
  }
}
