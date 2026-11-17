import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';
export const createCardPbInputSchema = z.object({
  rank: z.number().finite().optional(),
  issueType: z.enum(['historia', 'tarea', 'error']).default('historia'),
  epic: z.string().trim().max(100).default(''),
  storyPoints: z.number().int().min(0).max(1000).default(0),
  status: z.enum(['pendiente', 'en_progreso', 'completada']).default('pendiente'),
  title: z.string().trim().min(2, { error: 'El título debe tener al menos 2 caracteres' }).max(150),
  description: z.string().optional().default(''),
  groupId: mongoIdSchema,
  assignedTo: mongoIdSchema.optional(),
  dueDate: z.coerce
    .date()
    .nullish()
    .transform(v => (v ?? undefined)),
  priority: z.enum(['alta', 'media', 'baja']).optional().default('media'),
});
export type CreateCardPbInput = z.infer<typeof createCardPbInputSchema>;
const optionalNonEmptyString = z
  .string()
  .optional()
  .transform(v => (v && v.trim().length > 0 ? v.trim() : undefined));
export const getBacklogInputSchema = z.object({
  groupId: mongoIdSchema,
  search: optionalNonEmptyString,
  assignedTo: optionalNonEmptyString.pipe(mongoIdSchema.optional()),
});

export type GetBacklogInput = z.infer<typeof getBacklogInputSchema>;
export const deleteCardPbInputSchema = mongoIdSchema;
export type DeleteCardPbInput = z.infer<typeof deleteCardPbInputSchema>;
export const exportBacklogCsvInputSchema = mongoIdSchema;
export type ExportBacklogCsvInput = z.infer<typeof exportBacklogCsvInputSchema>;
export const updateCardPbInputSchema = z.object({
  title: z.string().trim().min(2).max(150).optional(),
  description: z.string().optional(),
  priority: z.enum(['alta', 'media', 'baja']).optional(),
  issueType: z.enum(['historia', 'tarea', 'error']).optional(),
  epic: z.string().trim().max(100).optional(),
  storyPoints: z.number().int().min(0).max(1000).optional(),
  status: z.enum(['pendiente', 'en_progreso', 'completada']).optional(),
  rank: z.number().finite().optional(),
  assignedTo: mongoIdSchema.nullable().optional(),
  dueDate: z.coerce.date().nullable().optional(),
});
export type UpdateCardPbInput = z.infer<typeof updateCardPbInputSchema>;

export const reorderBacklogInputSchema = z.object({ groupId: mongoIdSchema, sprintId: mongoIdSchema.nullable(), ids: z.array(mongoIdSchema).min(1).max(5000).refine(ids => new Set(ids).size === ids.length, 'Hay incidencias duplicadas') });
