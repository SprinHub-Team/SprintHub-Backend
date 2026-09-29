import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';
import { uploadFileInputRequestSchema } from '../../utils/FileDto';

export const uploadProjectDocumentInputSchema = z.object({
  title: z.string().min(2, { error: 'El título debe tener al menos 2 caracteres' }).max(150),
  groupId: mongoIdSchema,
  fileData: uploadFileInputRequestSchema,
});

export type UploadProjectDocumentInput = z.infer<typeof uploadProjectDocumentInputSchema>;

export const getProjectDocumentsInputSchema = z.object({
  groupId: mongoIdSchema,
});

export type GetProjectDocumentsInput = z.infer<typeof getProjectDocumentsInputSchema>;

export const deleteProjectDocumentInputSchema = mongoIdSchema;

export type DeleteProjectDocumentInput = z.infer<typeof deleteProjectDocumentInputSchema>;