import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';
import { uploadFileInputRequestSchema } from '../../utils/FileDto';
import { ICard } from '../../models/Card';

export const  createCardInputSchema = z.object({
  title: z.string().min(2, { error: 'El título debe tener al menos 2 caracteres' }),
  description: z.string().optional().default(''),
  columnId: mongoIdSchema,
  assignedTo: mongoIdSchema.nullable().optional(),
  dueDate: z.coerce.date().nullable().optional(),
  priority: z.enum(['alta', 'media', 'baja']).optional().default('media'),
});
export type CreateCardInput = z.infer<typeof createCardInputSchema>;

export const updateCardInputSchema = z.object({
  cardId: mongoIdSchema,
  status: z.enum(['pendiente', 'en_progreso', 'completada']).optional(),
  subtask: z.discriminatedUnion('action', [
    z.object({ action: z.literal('add'), id: z.string().uuid(), title: z.string().trim().min(1).max(200) }),
    z.object({ action: z.literal('toggle'), id: z.string().uuid(), completed: z.boolean() }),
    z.object({ action: z.literal('delete'), id: z.string().uuid() }),
  ]).optional(),
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  columnId: mongoIdSchema,
  assignedTo: mongoIdSchema.nullable().optional(),
  dueDate: z.coerce.date().nullable().optional(),
  priority: z.enum(['alta', 'media', 'baja']).optional(),
});


export type UpdateCardInput = z.infer<typeof updateCardInputSchema>;

export const deleteCardInputSchema = mongoIdSchema;
export type DeleteCardInput = z.infer<typeof deleteCardInputSchema>;

export const addCardFileInputSchema = z.object({
  cardId: mongoIdSchema,
  fileData: uploadFileInputRequestSchema,
});
export type AddCardFileInput = z.infer<typeof addCardFileInputSchema>;

export const removeCardFileInputSchema = z.object({
  cardId: mongoIdSchema,
  filePath: z.string().min(1),
});
export type RemoveCardFileInput = z.infer<typeof removeCardFileInputSchema>;

export type CreateCardDatabase = Pick<ICard,
'title' |
'description' |
'dueDate' |
'priority'> &
{
  columnId: string,
  assignedTo?: string | null
};

export type UpdateCardDatabase = Partial<Pick<ICard,
'description'|
'title' |
'priority' | 'dueDate' | 'status' | 'completedAt' >> &
{
  columnId?: string,
  assignedTo?: string | null
};
