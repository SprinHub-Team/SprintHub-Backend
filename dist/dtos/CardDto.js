"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardSchemaOutId = exports.cardSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.cardSchema = zod_1.default.object({
    id: zod_1.default.string(),
    title: zod_1.default.string().min(2, "El título debe tener al menos 2 caracteres"),
    description: zod_1.default.string().optional().default(''),
    columnId: zod_1.default.string(),
    position: zod_1.default.number().optional().default(0),
    assignedTo: zod_1.default.string().optional(),
    dueDate: zod_1.default.date().optional(),
    priority: zod_1.default.enum(['alta', 'media', 'baja']).optional().default('media'),
    tasks: zod_1.default.array(zod_1.default.object({
        _id: zod_1.default.string().optional(),
        title: zod_1.default.string(),
        completed: zod_1.default.boolean().default(false)
    })).optional().default([])
});
exports.cardSchemaOutId = exports.cardSchema.omit({
    id: true
});
