import {z} from 'zod';
import { mongoIdSchema } from '../utils/idValidator';

export const createBoardSchema = z.object({
  title: z
    .string()
    .min(2, {error: "El título debe tener al menos 2 caracteres"})
    .max(150),
  description: z.string().optional().default(""),
  groupId: mongoIdSchema,
});

export type CreateBoardDto = z.infer< typeof createBoardSchema>;

export const updateBoardSchema = createBoardSchema.omit({
  groupId: true,
}).partial();

export type UpdateBoardDto = z.infer<typeof updateBoardSchema>;
