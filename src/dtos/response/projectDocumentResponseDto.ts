import { IProjectDocument } from '../../models/ProjectDocument';
import { IUser } from '../../models/User';

export type ProjectDocumentWithUploader = Omit<IProjectDocument, 'uploadedBy'> & {
  uploadedBy: IUser;
};

export type ProjectDocumentResponse = {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  groupId: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};