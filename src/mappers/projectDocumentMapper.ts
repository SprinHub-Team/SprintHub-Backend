import { IProjectDocument } from '../models/ProjectDocument';
import { ProjectDocumentResponse } from '../dtos/response/projectDocumentResponseDto';

export class ProjectDocumentMapper {
  public static toResponse(doc: IProjectDocument): ProjectDocumentResponse {
    return {
      id: doc._id.toString(),
      title: doc.title,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      groupId: doc.groupId.toString(),
      uploadedBy: doc.uploadedBy.toString(),
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }
}
