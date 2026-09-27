import { IGroup } from '../../models/Group';
import { IUser } from '../../models/User';

export type GroupWithDetailsResponse = Omit<IGroup, 'members'> & {
  members: {
    user: Pick<IUser, '_id' | 'name' | 'email'>;
    role: 'admin' | 'collaborator';
  }[];
};

export type GroupResponse = {
  id: string;
  name: string;
  description: string;
  profilePicture: string;
};

export type GroupDetailsResponse = GroupResponse & {
  members: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'collaborator';
  }[];
};
