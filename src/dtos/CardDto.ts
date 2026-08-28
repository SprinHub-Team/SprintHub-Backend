import z from 'zod';

export const cardSchema = z.object({
    id: z.string(),
    title: z.string().min(2),
    description: z.string().min(2),
    columnId: z.string(),
    position: z.number(),
    assignedTo: z.string(),
    dueDate: z.date()
});

export type Card = z.infer<typeof cardSchema>;

export const createCardSchema = cardSchema.omit({
    id: true
});

export type CreateCardDto= z.infer<typeof createCardSchema>;

export const updateCardSchema = createCardSchema.omit({
    columnId: true
});

export type UpdateCardDto = z.infer<typeof updateCardSchema>;