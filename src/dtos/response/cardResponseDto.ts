import { ICard } from '../../models/Card';
import { CommentDetailsResponse, CommentWithDetails } from './commentResponseDto';
import { UserReference } from './userResponseDto';

export type CardWithDetails = Omit<ICard, 'assignedTo'> & {
  comments: CommentWithDetails[];
  assignedTo: UserReference
};

export interface CardDetailsResponse {
  id: string;
  title: string;
  description: string;
  columnId: string;
  dueDate: string | null;
  priority: 'alta' | 'media' | 'baja';
  files: { fileName: string; url: string; path: string }[];
  assignedTo: {
    id: string;
    name: string;
    email: string;
    profilePicture: string | undefined;
  } | null;
  comments: CommentDetailsResponse[]; 
}
