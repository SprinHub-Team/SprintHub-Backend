import z from "zod";
import { mongoIdSchema } from "../utils/idValidator";

export const createCommentSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  cardId: mongoIdSchema,
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = createCommentSchema.omit({
  cardId:true,
}).partial();

export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;

export const createCommentRequest = createCommentSchema;

export type CreateCommentRequest = z.infer<typeof createCommentRequest>;

export const updateCommentRequest = z.object({
  commentData: updateCommentSchema,
  paramData: z.object({commentId: mongoIdSchema})
});

export type UpdateCommentRequest = z.infer<typeof updateCommentRequest>;

export const deleteCommentRequest = mongoIdSchema;

export type DeleteCommentRequest = z.infer<typeof deleteCommentRequest>;