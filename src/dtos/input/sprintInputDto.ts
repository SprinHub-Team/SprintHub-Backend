import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';

export const createSprintInputSchema = z
  .object({
    name: z.string().min(2, { error: 'El nombre debe tener al menos 2 caracteres' }).max(100),
    goal: z.string().optional().default(''),
    startDate: z.coerce.date({ error: 'La fecha de inicio es obligatoria y debe ser válida' }),
    endDate: z.coerce.date({ error: 'La fecha de fin es obligatoria y debe ser válida' }),
    status: z.enum(['planificado', 'activo', 'completado']).optional().default('planificado'),
    groupId: mongoIdSchema,
  })
  .refine(d => d.startDate.getTime() < d.endDate.getTime(), {
    error: 'La fecha de fin debe ser posterior a la fecha de inicio',
    path: ['endDate'],
  });

export type CreateSprintInput = z.infer<typeof createSprintInputSchema>;

export const getSprintsByGroupInputSchema = z.object({
  groupId: mongoIdSchema,
});

export type GetSprintsByGroupInput = z.infer<typeof getSprintsByGroupInputSchema>;

export const moveCardToSprintInputSchema = z.object({
  cardId: mongoIdSchema,
  sprintId: mongoIdSchema
    .nullish()
    .transform(v => (v ?? null)),
});

export type MoveCardToSprintInput = z.infer<typeof moveCardToSprintInputSchema>;

export const getSprintCardsInputSchema = z.object({
  sprintId: mongoIdSchema,
});

export type GetSprintCardsInput = z.infer<typeof getSprintCardsInputSchema>;

export const exportToBoardInputSchema = z.object({
  cardId: mongoIdSchema,
  columnId: mongoIdSchema,
});

export type ExportToBoardInput = z.infer<typeof exportToBoardInputSchema>;