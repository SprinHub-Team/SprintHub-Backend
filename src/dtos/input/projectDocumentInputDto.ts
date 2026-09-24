import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';

export const createProjectDocumentInputSchema = z.object({
  title: z.string().min(1, 'El ttulo es obligatorio'),
  groupId: mongoIdSchema,
});

export const deleteProjectDocumentInputSchema = z.object({
  documentId: mongoIdSchema,
});

export type CreateProjectDocumentInput = z.infer<typeof createProjectDocumentInputSchema>;
export type DeleteProjectDocumentInput = z.infer<typeof deleteProjectDocumentInputSchema>;
