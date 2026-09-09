"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDocumentController = void 0;
class ProjectDocumentController {
    docService;
    constructor(docService) {
        this.docService = docService;
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
            const fileUrl = `/uploads/${file.filename}`;
            const doc = await this.docService.createDocument({
                title,
                fileName: file.originalname,
                fileUrl,
                groupId: groupId,
                uploadedBy: userId
            });
            res.status(201).json(doc);
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
            res.json(docs);
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
            await this.docService.deleteDocument(id, userId);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProjectDocumentController = ProjectDocumentController;
