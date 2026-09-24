"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDocumentController = void 0;
const projectDocumentMapper_1 = require("../mappers/projectDocumentMapper");
class ProjectDocumentController {
    docService;
    supabaseService;
    constructor(docService, supabaseService) {
        this.docService = docService;
        this.supabaseService = supabaseService;
    }
    async upload(req, res, next) {
        try {
            const { groupId } = req.params;
            const { title } = req.body;
            const file = req.file;
            const userId = req.user?.userId;
            if (!file)
                throw new Error('No se subió ningún archivo');
            if (!userId)
                throw new Error('No autorizado');
            if (!title)
                throw new Error('El título es requerido');
            const fileResult = await this.supabaseService.upload({ buffer: file.buffer, fileName: file.originalname, mimeType: file.mimetype, path: 'ProjectsDocuments' });
            const doc = await this.docService.createDocument({
                title,
                fileName: file.originalname,
                fileUrl: fileResult.url,
                groupId: groupId,
                uploadedBy: userId
            });
            res.status(201).json({ data: projectDocumentMapper_1.ProjectDocumentMapper.toResponse(doc) });
        }
        catch (error) {
            next(error);
        }
    }
    async getByGroup(req, res, next) {
        try {
            const { groupId } = req.params;
            const userId = req.user?.userId;
            if (!userId)
                throw new Error('No autorizado');
            const docs = await this.docService.getDocumentsByGroupId(groupId, userId);
            res.status(200).json({ data: docs.map(d => projectDocumentMapper_1.ProjectDocumentMapper.toResponse(d)) });
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            if (!userId)
                throw new Error('No autorizado');
            const fileUrl = await this.docService.deleteDocument(id, userId);
            // Attempt to delete from Supabase
            if (fileUrl) {
                try {
                    const parts = fileUrl.split('/sprinthub-files/');
                    if (parts.length > 1) {
                        const filePath = parts[1];
                        await this.supabaseService.delete(filePath);
                    }
                }
                catch (e) {
                    console.error('Error deleting from supabase:', e);
                }
            }
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProjectDocumentController = ProjectDocumentController;
