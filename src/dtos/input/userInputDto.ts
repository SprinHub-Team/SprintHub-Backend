import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';

export const updateUserInputSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.email().optional(),
  documentId: z.string().min(5).optional(),
  password: z.string().min(6).optional(),
  profilePicture: z.url().optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const deleteUserInputSchema = mongoIdSchema;
export type DeleteUserInput = z.infer<typeof deleteUserInputSchema>;

export const getUserByIdInputSchema = mongoIdSchema;
export type GetUserByIdInput = z.infer<typeof getUserByIdInputSchema>;
