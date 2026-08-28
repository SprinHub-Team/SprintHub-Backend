import { z } from 'zod';

export const userSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Debe ser un correo válido'),
  documentId: z.string().min(5, 'El documento debe tener al menos 5 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  role: z.enum(['admin', 'user']).default('user'),
});

export type UserType = z.infer<typeof userSchema>;

export const createUserSchema = userSchema.required({ password: true }).omit({ _id: true, role: true });
export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updateUserSchema = userSchema.omit({ _id: true, password: true }).partial();
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
export type LoginDto = z.infer<typeof loginSchema>;
