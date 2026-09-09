import { ProjectDocumentModel, IProjectDocument } from '../models/ProjectDocument';

export class ProjectDocumentRepository {
  async create(data: { title: string; fileName: string; fileUrl: string; groupId: string; uploadedBy: string }): Promise<IProjectDocument> {
    const doc = await ProjectDocumentModel.create(data);
    return doc.toObject();
  }

  async findByGroupId(groupId: string): Promise<IProjectDocument[]> {
    return ProjectDocumentModel.find({ groupId })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findById(id: string): Promise<IProjectDocument | null> {
    return ProjectDocumentModel.findById(id).lean().exec();
  }

  async delete(id: string): Promise<boolean> {
    const res = await ProjectDocumentModel.findByIdAndDelete(id).exec();
    return res !== null;
  }
}
