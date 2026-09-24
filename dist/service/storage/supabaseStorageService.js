"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_1 = __importDefault(require("../../config/supabase"));
const ValidationError_1 = __importDefault(require("../../errors/ValidationError"));
class SupabaseStorageService {
    bucket = 'sprinthub-files';
    async upload(fileData) {
        const extension = fileData.fileName.includes('.') ? `.${fileData.fileName.split('.').pop()?.toLowerCase()}` : '';
        const uniqueFileName = `${crypto.randomUUID()}${extension}`;
        const filePath = fileData.path ? `${fileData.path}/${uniqueFileName}` : uniqueFileName;
        const { data, error } = await supabase_1.default.storage.from(this.bucket).upload(filePath, fileData.buffer, {
            contentType: fileData.mimeType,
            upsert: false
        });
        if (error) {
            throw new ValidationError_1.default(`Error al subir el archivo: ${error.message}`);
        }
        const { data: publicUrl } = supabase_1.default.storage.from(this.bucket).getPublicUrl(data.path);
        return {
            path: data.path,
            fileName: fileData.fileName,
            url: publicUrl.publicUrl
        };
    }
    async delete(filePath) {
        const { error } = await supabase_1.default.storage.from(this.bucket).remove([filePath]);
        if (error) {
            throw new ValidationError_1.default(`Error al eliminar el archivo: ${error.message}`);
        }
    }
    async deleteMany(filePaths) {
        if (filePaths.length === 0) {
            return;
        }
        const { error } = await supabase_1.default.storage.from(this.bucket).remove(filePaths);
        if (error) {
            throw new ValidationError_1.default(`Error al eliminar los archivos: ${error.message}`);
        }
    }
}
exports.default = SupabaseStorageService;
