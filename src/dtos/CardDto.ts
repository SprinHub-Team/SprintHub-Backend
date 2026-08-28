import z from 'zod';

export const cardSchema = z.object({
    id: z.string(),
    title: z.string().min(2),
    description: z.string().min(2),
    boardId: z.string(),
    columnId: z.string(),
    commentsIds: z.array(z.string()),
    position: z.number(),
    assignedTo: z.array(z.string()),
    dueDate: z.date().optional()
});

export type Card = z.infer<typeof cardSchema>;

export const cardSchemaoutId = cardSchema.omit({
    id: true
});

export type CardSchemaoutId= z.infer<typeof cardSchemaoutId>;

