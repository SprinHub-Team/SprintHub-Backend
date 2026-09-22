import { ICard } from '../../models/Card';
import { IComment } from '../../models/Comment';
import { IUser } from '../../models/User';

export type CardWithDetails = Omit<ICard, 'assignedTo'> & {
  comments: IComment[];
  assignedTo: IUser | null;
};

export type CardResponse = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  assignedTo: string | null;
  dueDate: string | null;
  priority: 'alta' | 'media' | 'baja';
  files: { fileName: string; url: string; path: string }[];
}

export type CardDetailsResponse = Omit<CardResponse, 'assignedTo'> & {
  assignedTo: {
    id: string;
    name: string;
    email: string;
  } | null;
  comments: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    createdBy: string;
  }[];
}
