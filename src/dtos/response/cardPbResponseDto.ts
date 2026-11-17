import { ICardPB } from '../../models/CardPB';
import { IUser } from '../../models/User';

export type CardPbWithUser = Omit<ICardPB, 'assignedTo'> & {
  assignedTo: IUser | null;
};

export type CardPbResponse = {
  id: string;
  rank: number;
  issueType: 'historia' | 'tarea' | 'error';
  epic: string;
  storyPoints: number;
  status: 'pendiente' | 'en_progreso' | 'completada';
  title: string;
  description: string;
  groupId: string;
  sprintId: string | null;
  assignedTo: {
    id: string;
    name: string;
    email: string;
  } | null;
  dueDate: string | null;
  priority: 'alta' | 'media' | 'baja';
  createdAt: string;
  updatedAt: string;
};