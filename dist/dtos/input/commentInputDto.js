"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentInputSchema = exports.updateCommentInputSchema = exports.createCommentInputSchema = void 0;
const zod_1 = require("zod");
const idValidator_1 = require("../../utils/idValidator");
exports.createCommentInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().min(2),
    cardId: idValidator_1.mongoIdSchema,
});
exports.updateCommentInputSchema = zod_1.z.object({
    commentId: idValidator_1.mongoIdSchema,
    name: zod_1.z.string().min(2).optional(),
    description: zod_1.z.string().min(2).optional(),
});
exports.deleteCommentInputSchema = idValidator_1.mongoIdSchema;
