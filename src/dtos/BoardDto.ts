import {z} from 'zod';

export const boardSchema = z.object({
  id: z.string(),
  title: z.string().min(2).max(150),
  description: z.string().min(2),
  groupId: z.string(),
  ownerId: z.string()
});

export type Board = z.infer< typeof boardSchema>;

export const createBoardSchema = boardSchema.omit({
  id: true
});

export type CreateBoardDto = z.infer<typeof createBoardSchema>;

export const updateBoardSchema = createBoardSchema.partial();

export type UpdateBoardDto = z.infer<typeof updateBoardSchema>;
