import { z } from 'zod';

export const registerInputSchema = z.object({
  name: z.string().min(2, { error: 'El nombre debe tener al menos 2 caracteres' }).max(100),
  email: z.email({ error: 'Debe ser un correo electrónico válido' }),
  documentId: z.string().min(5, { error: 'El documento debe tener al menos 5 caracteres' }),
  password: z.string().min(6, { error: 'La contraseña debe tener al menos 6 caracteres' }),
});
export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z.object({
  email: z.email({ error: 'Formato de correo inválido' }),
  password: z.string().min(1, { error: 'La contraseña es obligatoria' }),
});
export type LoginInput = z.infer<typeof loginInputSchema>;
