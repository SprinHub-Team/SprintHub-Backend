import z from "zod";

export const commentSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  description: z.string().min(2),
  columnId: z.string(),
  CreatedFor: z.string(),
});

export type Comment = z.infer<typeof commentSchema>;

export const createCommentSchema = commentSchema.omit({
  id: true,
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = createCommentSchema.partial();

export type UpdateCommentDto = z.infer<typeof updateCommentSchema>;
