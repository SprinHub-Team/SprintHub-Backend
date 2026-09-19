import z from 'zod';
import { mongoIdSchema } from '../utils/idValidator';

export const createCardSchema = z.object({
    title: z.string().min(2, {error: "El título debe tener al menos 2 caracteres"}),
    description: z.string().optional(),
    columnId: mongoIdSchema,
    assignedTo: mongoIdSchema,
    dueDate: z.date().optional(),
    priority: z.enum(['alta', 'media', 'baja']).optional().default('media'),
});

export type CreateCardDto = z.infer<typeof createCardSchema>;

export const updateCardSchema = createCardSchema.partial();

export type UpdateCardDto = z.infer<typeof updateCardSchema>;

export const createCardRequest = createCardSchema;

export type CreateCardRequest = z.infer<typeof createCardRequest>;

export const updateCardRequest = z.object({
	cardData: updateCardSchema,
	paramData: z.object({cardId: mongoIdSchema})
});

export type UpdateCardRequest = z.infer<typeof updateCardRequest>;

export const deleteCardRequest = mongoIdSchema;

export type DeleteCardRequest = z.infer<typeof deleteCardRequest>;