import z from 'zod';

export const cardSchema = z.object({
    id: z.string(),
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

export type Card = z.infer<typeof cardSchema>;

export const cardSchemaOutId = cardSchema.omit({
    id: true
});

export type CardSchemaoutId = z.infer<typeof cardSchemaOutId>;

