import { IComment } from '../../models/Comment';
import { IUser } from '../../models/User';

export type CommentWithDetails = Omit<IComment, 'createdBy'> & {
  createdBy: IUser ;
};

export type CommentResponse = {
  id: string;
  name: string;
  description: string;
  cardId: string;
  createdBy: string;
};

export type CommentDetailsResponse = Omit<CommentResponse, 'createdBy'> & {
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    profilePicture: string;
  };
};
