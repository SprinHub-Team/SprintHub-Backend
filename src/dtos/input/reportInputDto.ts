import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';

const isoDateStringSchema = z.string().refine(v => !Number.isNaN(Date.parse(v)), {
  error: 'Debe ser una fecha válida en formato ISO 8601 (ej: 2025-01-31)',
});

export const getGroupPerformanceInputSchema = z.object({
  groupId: mongoIdSchema,
});

export type GetGroupPerformanceInput = z.infer<typeof getGroupPerformanceInputSchema>;

export const getUserPerformanceInputSchema = z
  .object({
    userId: mongoIdSchema,
    startDate: isoDateStringSchema.optional(),
    endDate: isoDateStringSchema.optional(),
  })
  .refine(d => !d.startDate || !d.endDate || Date.parse(d.startDate) <= Date.parse(d.endDate), {
    error: 'La fecha de fin debe ser posterior o igual a la fecha de inicio',
    path: ['endDate'],
  });

  export type GetUserPerformanceInput = z.infer<typeof getUserPerformanceInputSchema>;

export const getCompletedActivitiesInputSchema = z.object({
  groupId: mongoIdSchema,
});

export type GetCompletedActivitiesInput = z.infer<typeof getCompletedActivitiesInputSchema>;