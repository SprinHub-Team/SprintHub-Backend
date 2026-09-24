"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDocumentRepository = void 0;
const ProjectDocument_1 = require("../models/ProjectDocument");
class ProjectDocumentRepository {
    async create(data) {
        const doc = await ProjectDocument_1.ProjectDocumentModel.create(data);
        return doc.toObject();
    }
    async findByGroupId(groupId) {
        return ProjectDocument_1.ProjectDocumentModel.find({ groupId })
            .populate('uploadedBy', 'name email')
            .sort({ createdAt: -1 })
            .lean()
            .exec();
    }
    async findById(id) {
        return ProjectDocument_1.ProjectDocumentModel.findById(id).lean().exec();
    }
    async delete(id) {
        const res = await ProjectDocument_1.ProjectDocumentModel.findByIdAndDelete(id).exec();
        return res !== null;
    }
}
exports.ProjectDocumentRepository = ProjectDocumentRepository;
