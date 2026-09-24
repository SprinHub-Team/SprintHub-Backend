"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
const ValidationError_1 = __importDefault(require("../../errors/ValidationError"));
class CloudinaryStorageService {
    async upload(fileData) {
        return new Promise((resolve, reject) => {
            const uniqueFileName = crypto.randomUUID();
            const folderPath = fileData.path ? fileData.path : '';
            const uploadStream = cloudinary_1.default.uploader.upload_stream({
                folder: folderPath,
                public_id: uniqueFileName,
                resource_type: 'auto',
            }, (error, result) => {
                if (error || !result) {
                    return reject(new ValidationError_1.default(`Error al subir el archivo: ${error?.message || 'Error desconocido'}`));
                }
                resolve({
                    path: result.public_id,
                    fileName: fileData.fileName,
                    url: result.secure_url,
                });
            });
            uploadStream.end(fileData.buffer);
        });
    }
    async delete(filePath) {
        try {
            const result = await cloudinary_1.default.uploader.destroy(filePath);
            if (result.result !== 'ok' && result.result !== 'not_found') {
                throw new Error(result.result);
            }
        }
        catch (error) {
            throw new ValidationError_1.default(`Error al eliminar el archivo: ${error.message}`);
        }
    }
    async deleteMany(filePaths) {
        if (filePaths.length === 0) {
            return;
        }
        try {
            await cloudinary_1.default.api.delete_resources(filePaths);
        }
        catch (error) {
            throw new ValidationError_1.default(`Error al eliminar los archivos: ${error.message}`);
        }
    }
}
exports.default = CloudinaryStorageService;
