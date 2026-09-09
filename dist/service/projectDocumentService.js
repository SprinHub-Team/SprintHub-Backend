"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDocumentService = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
class ProjectDocumentService {
    docRepo;
    groupRepo;
    constructor(docRepo, groupRepo) {
        this.docRepo = docRepo;
        this.groupRepo = groupRepo;
    }
    async createDocument(data) {
        const group = await this.groupRepo.findById(data.groupId);
        if (!group)
            throw new AppError_1.default('Grupo no encontrado', 404);
        const member = group.members.find(m => m.user._id?.toString() === data.uploadedBy || m.user.toString() === data.uploadedBy);
        if (!member || (member.role !== 'admin' && member.role !== 'collaborator' && group.ownerId._id?.toString() !== data.uploadedBy)) {
            throw new AppError_1.default('Solo administradores y colaboradores pueden subir documentos', 403);
        }
        return this.docRepo.create(data);
    }
    async getDocumentsByGroupId(groupId, userId) {
        const group = await this.groupRepo.findById(groupId);
        if (!group)
            throw new AppError_1.default('Grupo no encontrado', 404);
        const isMember = group.members.some(m => m.user._id?.toString() === userId || m.user.toString() === userId) || group.ownerId._id?.toString() === userId;
        if (!isMember)
            throw new AppError_1.default('No tienes acceso a este grupo', 403);
        return this.docRepo.findByGroupId(groupId);
    }
    async deleteDocument(id, userId) {
        const doc = await this.docRepo.findById(id);
        if (!doc)
            throw new AppError_1.default('Documento no encontrado', 404);
        const group = await this.groupRepo.findById(doc.groupId.toString());
        if (!group)
            throw new AppError_1.default('Grupo no encontrado', 404);
        const member = group.members.find(m => m.user._id?.toString() === userId || m.user.toString() === userId);
        if (!member || (member.role !== 'admin' && member.role !== 'collaborator' && group.ownerId._id?.toString() !== userId)) {
            throw new AppError_1.default('Solo administradores y colaboradores pueden eliminar documentos', 403);
        }
        return this.docRepo.delete(id);
    }
}
exports.ProjectDocumentService = ProjectDocumentService;
