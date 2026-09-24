"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByIdInputSchema = exports.deleteUserInputSchema = exports.updateUserInputSchema = void 0;
const zod_1 = require("zod");
const idValidator_1 = require("../../utils/idValidator");
exports.updateUserInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    email: zod_1.z.email().optional(),
    documentId: zod_1.z.string().min(5).optional(),
    password: zod_1.z.string().min(6).optional(),
    profilePicture: zod_1.z.url().optional(),
});
exports.deleteUserInputSchema = idValidator_1.mongoIdSchema;
exports.getUserByIdInputSchema = idValidator_1.mongoIdSchema;
