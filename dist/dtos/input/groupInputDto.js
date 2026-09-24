"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGroupMemberRoleInputSchema = exports.removeGroupMemberInputSchema = exports.addGroupMemberInputSchema = exports.updateGroupInputSchema = exports.createGroupInputSchema = void 0;
const zod_1 = require("zod");
const idValidator_1 = require("../../utils/idValidator");
const FileDto_1 = require("../../utils/FileDto");
exports.createGroupInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { error: 'El nombre debe tener al menos 2 caracteres' }).max(100),
    description: zod_1.z.string().optional().default(''),
    filePicture: FileDto_1.uploadFileInputRequestSchema.optional()
});
exports.updateGroupInputSchema = zod_1.z.object({
    groupId: idValidator_1.mongoIdSchema,
    name: zod_1.z.string().min(2).max(100).optional(),
    description: zod_1.z.string().optional(),
    visibility: zod_1.z.enum(['private', 'public']).optional(),
    filePicture: FileDto_1.uploadFileInputRequestSchema.optional()
});
exports.addGroupMemberInputSchema = zod_1.z.object({
    groupId: idValidator_1.mongoIdSchema,
    email: zod_1.z.email({ error: 'Debe ser un correo válido' }),
    role: zod_1.z.enum(['admin', 'collaborator', 'visitor']),
});
exports.removeGroupMemberInputSchema = zod_1.z.object({
    groupId: idValidator_1.mongoIdSchema,
    userId: idValidator_1.mongoIdSchema,
});
exports.updateGroupMemberRoleInputSchema = zod_1.z.object({
    groupId: idValidator_1.mongoIdSchema,
    userId: idValidator_1.mongoIdSchema,
    role: zod_1.z.enum(['admin', 'collaborator', 'visitor']),
});
