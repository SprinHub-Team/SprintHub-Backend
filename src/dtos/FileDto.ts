import { string, z } from 'zod';

export const uploadFileInputSchema = z.object({
    buffer: z.instanceof(Buffer),
    fileName: string(),
    mimeType: string(),
    path: string()
});

export type UploadFileInputDto = z.infer<typeof uploadFileInputSchema>;

export const uploadFileInputRequestSchema = uploadFileInputSchema.omit({
    path: true
});

export type UploadFileInputRequest = z.infer<typeof uploadFileInputRequestSchema>;

export const uploadFileResultSchema = z.object({
    path: z.string(),
    fileName: z.string(),
    url: string()
})

export type UploadFileResultDto = z.infer<typeof uploadFileResultSchema>;
