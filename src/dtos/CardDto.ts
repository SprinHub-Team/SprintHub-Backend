import z from 'zod';
import { mongoIdSchema } from '../utils/idValidator';

export const createCardSchema = z.object({
    title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
    description: z.string().optional().default(''),
    columnId: z.string(),
    position: z.number().optional().default(0),
    assignedTo: z.string().optional(),
    dueDate: z.date().optional(),
    priority: z.enum(['alta', 'media', 'baja']).optional().default('media'),
    tasks: z.array(z.object({
        _id: z.string().optional(),
        title: z.string(),
        completed: z.boolean().default(false)
    })).optional().default([])
});

export type CreateCardDto = z.infer<typeof createCardSchema>;

export const updateCardSchema = createCardSchema.partial();

export type UpdateCardDto = z.infer<typeof updateCardSchema>;

export const createCardRequest = z.object({
	cardData: createCardSchema,
	paramData: z.object({boardId: mongoIdSchema})
});

export type CreateCardRequest = z.infer<typeof createCardRequest>;

export const updateCardRequest = z.object({
	cardData: updateCardSchema,
	paramData: z.object({boardId: mongoIdSchema, cardId: mongoIdSchema})
});

export type UpdateCardRequest = z.infer<typeof updateCardRequest>;

export const deleteCardRequest = z.object({
  boardId: mongoIdSchema,
  cardId: mongoIdSchema
});

export type DeleteCardRequest = z.infer<typeof deleteCardRequest>;