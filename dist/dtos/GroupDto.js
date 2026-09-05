"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMemberSchema = exports.createGroupSchema = exports.groupSchema = void 0;
const zod_1 = require("zod");
exports.groupSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    description: zod_1.z.string().optional(),
    ownerId: zod_1.z.string(),
    members: zod_1.z.array(zod_1.z.object({
        user: zod_1.z.string(),
        role: zod_1.z.enum(['admin', 'collaborator', 'visitor'])
    })).optional()
});
exports.createGroupSchema = exports.groupSchema.pick({
    name: true,
    description: true,
});
exports.addMemberSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    role: zod_1.z.enum(['admin', 'collaborator', 'visitor'])
});
