import { ProjectDocumentModel, IProjectDocument } from '../models/ProjectDocument';
import { ProjectDocumentWithUploader } from '../dtos/response/projectDocumentResponseDto';
export class ProjectDocumentRepository {

  async create(data: {
    title: string;
    fileName: string;
    fileUrl: string;
    filePath?: string;
    groupId: string;
    uploadedBy: string;
  }): Promise<ProjectDocumentWithUploader> {
    const doc = await ProjectDocumentModel.create(data);
    await doc.populate('uploadedBy', 'name email');
    return doc.toObject() as unknown as ProjectDocumentWithUploader;
  }
  
  async findByGroupId(groupId: string): Promise<ProjectDocumentWithUploader[]> {
    return ProjectDocumentModel.find({ groupId })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean()
      .exec() as unknown as Promise<ProjectDocumentWithUploader[]>;
  }

  async findById(id: string): Promise<IProjectDocument | null> {
    return ProjectDocumentModel.findById(id).lean().exec();
  }

  async delete(id: string): Promise<IProjectDocument | null> {
    return ProjectDocumentModel.findByIdAndDelete(id).lean().exec();
  }

}