import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';
import { uploadFileInputRequestSchema } from '../../utils/FileDto';

export const createCardInputSchema = z.object({
  title: z.string().min(2, { error: 'El título debe tener al menos 2 caracteres' }),
  description: z.string().optional().default(''),
  columnId: mongoIdSchema,
  assignedTo: mongoIdSchema.optional(),
  dueDate: z.date().optional(),
  priority: z.enum(['alta', 'media', 'baja']).optional().default('media'),
});
export type CreateCardInput = z.infer<typeof createCardInputSchema>;

export const updateCardInputSchema = z.object({
  cardId: mongoIdSchema,
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  columnId: mongoIdSchema,
  assignedTo: mongoIdSchema.optional(),
  dueDate: z.date().optional(),
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
