import z from 'zod';
import { mongoIdSchema } from '../utils/idValidator';

export const createCardSchema = z.object({
    title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
    description: z.string().optional().default(''),
    columnId: mongoIdSchema,
    position: z.number().optional().default(0),
    assignedTo: mongoIdSchema,
    dueDate: z.date().optional(),
    priority: z.enum(['alta', 'media', 'baja']).optional().default('media'),
    tasks: z.array(z.object({
        _id: mongoIdSchema.optional(),
        title: z.string(),
        completed: z.boolean().default(false)
    })).optional().default([])
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