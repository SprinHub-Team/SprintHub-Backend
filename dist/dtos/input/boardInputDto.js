"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoardInputSchema = exports.applyBoardTemplateInputSchema = exports.updateBoardInputSchema = exports.createBoardInputSchema = void 0;
const zod_1 = require("zod");
const idValidator_1 = require("../../utils/idValidator");
exports.createBoardInputSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, { error: 'El título debe tener al menos 2 caracteres' }).max(150),
    description: zod_1.z.string().optional().default(''),
    groupId: idValidator_1.mongoIdSchema,
    templateId: zod_1.z.string().optional(),
});
exports.updateBoardInputSchema = zod_1.z.object({
    id: idValidator_1.mongoIdSchema,
    title: zod_1.z.string().min(2).max(150).optional(),
    description: zod_1.z.string().optional(),
});
exports.applyBoardTemplateInputSchema = zod_1.z.object({
    boardId: idValidator_1.mongoIdSchema,
    templateId: zod_1.z.string().min(1),
});
exports.deleteBoardInputSchema = idValidator_1.mongoIdSchema;
