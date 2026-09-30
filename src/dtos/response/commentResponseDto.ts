import { IComment } from '../../models/Comment';
import { UserReference } from './userResponseDto';


export type CommentWithDetails = Omit<IComment, 'createdBy'> & {
  createdBy: UserReference
};

export type CommentDetailsResponse = {
  id: string;
  name: string;
  description: string;
  cardId: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
  };
};
