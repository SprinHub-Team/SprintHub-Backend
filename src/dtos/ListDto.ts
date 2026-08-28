import { z } from 'zod';

export const listSchema = z.object({
  _id: z.string().optional(), // Id suele venir como string desde el cliente o al serializar
  title: z.string().min(1, 'El título es obligatorio').max(100),
  boardId: z.string(),
  position: z.number().int().min(0).default(0),
});

export type ListType = z.infer<typeof listSchema>;

export const createListSchema = listSchema.omit({ _id: true });
export type CreateListDto = z.infer<typeof createListSchema>;

export const updateListSchema = createListSchema.partial();
export type UpdateListDto = z.infer<typeof updateListSchema>;
