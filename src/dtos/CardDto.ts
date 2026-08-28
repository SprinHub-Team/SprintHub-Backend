import z from 'zod';

export const cardSchema = z.object({
    id: z.string(),
    title: z.string().min(2),
    description: z.string().min(2),
    boardId: z.string(),
    columnId: z.string(),
    position: z.number(),
    assignedTo: z.array(z.string()),
    dueDate: z.date().optional()
});

export type Card = z.infer<typeof cardSchema>;

export const createCardSchema = cardSchema.omit({
    id: true
});

export type CreateCardDto= z.infer<typeof createCardSchema>;

export const updateCardSchema = createCardSchema.partial();

export type UpdateCardDto = z.infer<typeof updateCardSchema>;