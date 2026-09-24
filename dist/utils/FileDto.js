"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileInputRequestSchema = exports.uploadFileResultSchema = exports.uploadFileInputSchema = void 0;
const file_type_1 = require("file-type");
const zod_1 = require("zod");
exports.uploadFileInputSchema = zod_1.z.object({
    buffer: zod_1.z.instanceof(Buffer),
    fileName: (0, zod_1.string)(),
    mimeType: (0, zod_1.string)(),
    path: (0, zod_1.string)()
});
exports.uploadFileResultSchema = zod_1.z.object({
    path: zod_1.z.string(),
    fileName: zod_1.z.string(),
    url: (0, zod_1.string)()
});
const ALLOWED_MIMES = [
    'image/png', 'image/jpeg', 'image/webp',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-m4a', 'audio/m4a',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
];
const MAX_FILE_SIZE = 15 * 1024 * 1024;
exports.uploadFileInputRequestSchema = zod_1.z.object({
    originalname: zod_1.z.string(),
    buffer: zod_1.z.instanceof(Buffer)
})
    .superRefine(async (file, ctx) => {
    if (file.buffer.length > MAX_FILE_SIZE) {
        ctx.addIssue({
            code: 'custom',
            message: 'El archivo supera el límite máximo de 15MB.'
        });
        return;
    }
    const detectedType = await (0, file_type_1.fileTypeFromBuffer)(file.buffer);
    if (!detectedType || !ALLOWED_MIMES.includes(detectedType.mime)) {
        ctx.addIssue({
            code: 'custom',
            message: 'Formato de archivo no válido o contenido corrupto.'
        });
    }
})
    .transform(async (file) => {
    const detectedType = await (0, file_type_1.fileTypeFromBuffer)(file.buffer);
    return {
        fileName: file.originalname,
        buffer: file.buffer,
        mimeType: detectedType?.mime ?? 'application/octet-stream'
    };
});
