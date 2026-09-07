import {z} from 'zod';
import { mongoIdSchema } from '../utils/idValidator';

export const createColumnSchema = z.object({
  name: z.string().min(2).max(150),
  boardId: z.string(),
});

export type CreateColumnDto = z.infer< typeof createColumnSchema>;

export const updateColumnSchema = createColumnSchema.omit({
  boardId: true
});

export type UpdateColumnDto = z.infer<typeof updateColumnSchema>;

export const createColumnRequest = z.object({
  columnData: createColumnSchema,
  paramData: z.object({boardId: mongoIdSchema})
});

export type CreateColumnRequest = z.infer<typeof createColumnRequest>;

export const updateColumnRequest = z.object({
  columnData: updateColumnSchema,
  paramData: z.object({boardId: mongoIdSchema, columnId: mongoIdSchema})
});

export type UpdateColumnRequest = z.infer<typeof updateColumnRequest>;

export const deleteColumnRequest = z.object({
  boardId: mongoIdSchema,
  columnId: mongoIdSchema
});

export type DeleteColumnRequest = z.infer<typeof deleteColumnRequest>;