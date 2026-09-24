"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProjectDocumentInputSchema = exports.createProjectDocumentInputSchema = void 0;
const zod_1 = require("zod");
const idValidator_1 = require("../../utils/idValidator");
exports.createProjectDocumentInputSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'El ttulo es obligatorio'),
    groupId: idValidator_1.mongoIdSchema,
});
exports.deleteProjectDocumentInputSchema = zod_1.z.object({
    documentId: idValidator_1.mongoIdSchema,
});
