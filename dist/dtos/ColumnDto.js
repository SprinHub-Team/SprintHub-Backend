"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateColumnSchema = exports.createColumnSchema = exports.columnSchema = void 0;
const zod_1 = require("zod");
exports.columnSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().min(2).max(150),
    boardId: zod_1.z.string(),
});
exports.createColumnSchema = exports.columnSchema.omit({
    id: true
});
exports.updateColumnSchema = exports.createColumnSchema.omit({
    boardId: true
});
