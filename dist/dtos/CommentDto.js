"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentSchema = exports.createCommentSchema = exports.commentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.commentSchema = zod_1.default.object({
    id: zod_1.default.string(),
    name: zod_1.default.string().min(2),
    description: zod_1.default.string().min(2),
    cardId: zod_1.default.string(),
    createdFor: zod_1.default.string(),
});
exports.createCommentSchema = exports.commentSchema.omit({
    id: true,
});
exports.updateCommentSchema = exports.createCommentSchema.omit({
    cardId: true,
    createdFor: true
}).partial();
