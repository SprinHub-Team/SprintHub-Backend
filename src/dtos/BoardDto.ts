import {z} from 'zod';

export const createBoardSchema = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres").max(150),
  description: z.string().optional().default(''),
  groupId: z.string(),
  ownerId: z.string(),
});

export type CreateBoardDto = z.infer< typeof createBoardSchema>;

export const updateBoardSchema = createBoardSchema.omit({
  groupId: true,
  ownerId: true
}).partial();

export type UpdateBoardDto = z.infer<typeof updateBoardSchema>;
