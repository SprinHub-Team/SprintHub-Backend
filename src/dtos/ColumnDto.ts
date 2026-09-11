import {z} from 'zod';
import { mongoIdSchema } from '../utils/idValidator';

export const createColumnSchema = z.object({
  name: z.string().min(2).max(150),
  boardId: mongoIdSchema,
});

export type CreateColumnDto = z.infer< typeof createColumnSchema>;

export const updateColumnSchema = createColumnSchema.omit({
  boardId: true
});

export type UpdateColumnDto = z.infer<typeof updateColumnSchema>;

export const createColumnRequest = createColumnSchema;

export type CreateColumnRequest = z.infer<typeof createColumnRequest>;

export const updateColumnRequest = z.object({
  columnData: updateColumnSchema,
  paramData: z.object({columnId: mongoIdSchema})
});

export type UpdateColumnRequest = z.infer<typeof updateColumnRequest>;

export const deleteColumnRequest = mongoIdSchema
;

export type DeleteColumnRequest = z.infer<typeof deleteColumnRequest>;