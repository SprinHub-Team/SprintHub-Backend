"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBoardSchema = exports.createBoardSchema = exports.boardSchema = void 0;
const zod_1 = require("zod");
exports.boardSchema = zod_1.z.object({
    id: zod_1.z.string(),
    title: zod_1.z.string().min(2, "El título debe tener al menos 2 caracteres").max(150),
    description: zod_1.z.string().optional().default(''),
    groupId: zod_1.z.string(),
    ownerId: zod_1.z.string(),
});
exports.createBoardSchema = exports.boardSchema.omit({
    id: true
});
exports.updateBoardSchema = exports.createBoardSchema.omit({
    groupId: true,
    ownerId: true
}).partial();
