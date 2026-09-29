import { ProjectDocumentResponse, ProjectDocumentWithUploader } from '../dtos/response/projectDocumentResponseDto';

export class ProjectDocumentMapper {

  public static toResponse(doc: ProjectDocumentWithUploader): ProjectDocumentResponse {
    const uploader = doc.uploadedBy as unknown as { _id?: unknown; name?: string; email?: string };
    return {
      id: doc._id.toString(),
      title: doc.title,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      groupId: doc.groupId.toString(),
      uploadedBy: {
        id: uploader && uploader._id ? uploader._id.toString() : '',
        name: uploader?.name ?? '',
        email: uploader?.email ?? '',
      },
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date(0).toISOString(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date(0).toISOString(),
    };
  }

}