import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';

export const createSprintInputSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  goal: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(['planificado', 'activo', 'completado']).default('planificado'),
  groupId: mongoIdSchema,
});

export const updateSprintInputSchema = createSprintInputSchema.partial().extend({
  sprintId: mongoIdSchema,
});

export const deleteSprintInputSchema = z.object({
  sprintId: mongoIdSchema,
});

export type CreateSprintInput = z.infer<typeof createSprintInputSchema>;
export type UpdateSprintInput = z.infer<typeof updateSprintInputSchema>;
export type DeleteSprintInput = z.infer<typeof deleteSprintInputSchema>;
