"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDocumentMapper = void 0;
class ProjectDocumentMapper {
    static toResponse(doc) {
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
exports.ProjectDocumentMapper = ProjectDocumentMapper;
