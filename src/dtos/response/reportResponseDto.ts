import type { Types } from 'mongoose';
import { ICard } from '../../models/Card';

export type GroupPerformanceResponse = {
  created: number;
  completed: number;
  overdue: number;
  pending: number;
};

export type UserPerformanceResponse = GroupPerformanceResponse & {
  userId: string;
};

export type CompletedCard = Omit<ICard, 'assignedTo' | 'dueDate' | 'createdAt'> & {
  assignedTo?: Types.ObjectId | string | null;
  dueDate?: Date | string | null;
  createdAt?: Date | string | null;
};

export type CompletedActivityResponse = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  assignedTo: string | null;
  dueDate: string | null;
  priority: 'alta' | 'media' | 'baja';
  files: { fileName: string; url: string; path: string }[];
  createdAt: string | null;
};