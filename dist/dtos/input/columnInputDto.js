"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteColumnInputSchema = exports.updateColumnInputSchema = exports.createColumnInputSchema = void 0;
const zod_1 = require("zod");
const idValidator_1 = require("../../utils/idValidator");
exports.createColumnInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { error: 'El nombre debe tener al menos 2 caracteres' }).max(150),
    boardId: idValidator_1.mongoIdSchema,
});
exports.updateColumnInputSchema = zod_1.z.object({
    columnId: idValidator_1.mongoIdSchema,
    name: zod_1.z.string().min(2).max(150),
});
exports.deleteColumnInputSchema = idValidator_1.mongoIdSchema;
