import { IGroup } from '../../models/Group';
import { IUser } from '../../models/User';

export type GroupWithDetailsResponse = Omit<IGroup, 'ownerId' | 'members'> & {
  ownerId: Pick<IUser, '_id' | 'name' | 'email'>;
  members: {
    user: Pick<IUser, '_id' | 'name' | 'email'>;
    role: 'admin' | 'collaborator' | 'visitor';
  }[];
};

export type GroupResponse = {
  id: string;
  name: string;
  description: string;
  visibility: 'private' | 'public';
  profilePicture: string;
  ownerId: string;
};

export type GroupDetailsResponse = Omit<GroupResponse, 'ownerId'> & {
  owner: {
    id: string;
    name: string;
    email: string;
  };
  members: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'collaborator' | 'visitor';
  }[];
};
