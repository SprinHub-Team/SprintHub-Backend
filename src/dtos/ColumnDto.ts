import {z} from 'zod';

export const columnSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(150),
  boardId: z.string(),
});

export type Column = z.infer< typeof columnSchema>;

export const createColumnSchema = columnSchema.omit({
  id: true
});

export type CreateColumnDto = z.infer<typeof createColumnSchema>;

export const updateColumnSchema = createColumnSchema.partial();

export type UpdateColumnDto = z.infer<typeof updateColumnSchema>;
