import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';
import { IComment } from '../../models/Comment';

export const createCommentInputSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  cardId: mongoIdSchema,
});
export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;

export const updateCommentInputSchema = z.object({
  commentId: mongoIdSchema,
  name: z.string().min(2).optional(),
  description: z.string().min(2).optional(),
});
export type UpdateCommentInput = z.infer<typeof updateCommentInputSchema>;

export const deleteCommentInputSchema = mongoIdSchema;
export type DeleteCommentInput = z.infer<typeof deleteCommentInputSchema>;

export type CreateCommentDatabase = Pick<IComment,
'name' | 
'description'> & 
{
  cardId: string;
  createdBy: string;
};

export type UpdateCommentDatabase = Partial<Pick<IComment,
'name' | 
'description'>>;