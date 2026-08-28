import { z } from 'zod';

export const groupSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  description: z.string().optional(),
  ownerId: z.string(),
  members: z.array(z.object({
    user: z.string(),
    role: z.enum(['admin', 'collaborator', 'visitor'])
  })).optional()
});

export type GroupType = z.infer<typeof groupSchema>;

export const createGroupSchema = groupSchema.pick({
  name: true,
  description: true,
});
export type CreateGroupDto = z.infer<typeof createGroupSchema>;

export const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'collaborator', 'visitor'])
});
export type AddMemberDto = z.infer<typeof addMemberSchema>;
