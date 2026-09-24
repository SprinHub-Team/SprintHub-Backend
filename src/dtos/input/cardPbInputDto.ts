import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';

export const createCardPbInputSchema = z.object({
  title: z.string().min(1, 'El ttulo es obligatorio'),
  description: z.string().optional(),
  groupId: mongoIdSchema,
  sprintId: mongoIdSchema.optional().nullable(),
  assignedTo: mongoIdSchema.optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  priority: z.enum(['alta', 'media', 'baja']).default('media'),
});

export const updateCardPbInputSchema = createCardPbInputSchema.partial().extend({
  cardPbId: mongoIdSchema,
});

export const deleteCardPbInputSchema = z.object({
  cardPbId: mongoIdSchema,
});

export type CreateCardPbInput = z.infer<typeof createCardPbInputSchema>;
export type UpdateCardPbInput = z.infer<typeof updateCardPbInputSchema>;
export type DeleteCardPbInput = z.infer<typeof deleteCardPbInputSchema>;
