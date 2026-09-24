"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCardFileInputSchema = exports.addCardFileInputSchema = exports.deleteCardInputSchema = exports.updateCardInputSchema = exports.createCardInputSchema = void 0;
const zod_1 = require("zod");
const idValidator_1 = require("../../utils/idValidator");
const FileDto_1 = require("../../utils/FileDto");
exports.createCardInputSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, { error: 'El título debe tener al menos 2 caracteres' }),
    description: zod_1.z.string().optional().default(''),
    columnId: idValidator_1.mongoIdSchema,
    assignedTo: idValidator_1.mongoIdSchema.optional(),
    dueDate: zod_1.z.date().optional(),
    priority: zod_1.z.enum(['alta', 'media', 'baja']).optional().default('media'),
});
exports.updateCardInputSchema = zod_1.z.object({
    cardId: idValidator_1.mongoIdSchema,
    title: zod_1.z.string().min(2).optional(),
    description: zod_1.z.string().optional(),
    columnId: idValidator_1.mongoIdSchema,
    assignedTo: idValidator_1.mongoIdSchema.optional(),
    dueDate: zod_1.z.date().optional(),
    priority: zod_1.z.enum(['alta', 'media', 'baja']).optional(),
});
exports.deleteCardInputSchema = idValidator_1.mongoIdSchema;
exports.addCardFileInputSchema = zod_1.z.object({
    cardId: idValidator_1.mongoIdSchema,
    fileData: FileDto_1.uploadFileInputRequestSchema,
});
exports.removeCardFileInputSchema = zod_1.z.object({
    cardId: idValidator_1.mongoIdSchema,
    filePath: zod_1.z.string().min(1),
});
