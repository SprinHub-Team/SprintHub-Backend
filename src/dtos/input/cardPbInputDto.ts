import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';
export const createCardPbInputSchema = z.object({
  title: z.string().min(2, { error: 'El título debe tener al menos 2 caracteres' }).max(150),
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