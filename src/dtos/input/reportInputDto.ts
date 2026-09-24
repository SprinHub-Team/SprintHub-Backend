import { z } from 'zod';
import { mongoIdSchema } from '../../utils/idValidator';

export const getGroupPerformanceSchema = z.object({
  groupId: mongoIdSchema,
});

export const getUserPerformanceSchema = z.object({
  userId: mongoIdSchema,
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const getCompletedActivitiesSchema = z.object({
  groupId: mongoIdSchema,
});

export type GetGroupPerformanceInput = z.infer<typeof getGroupPerformanceSchema>;
export type GetUserPerformanceInput = z.infer<typeof getUserPerformanceSchema>;
export type GetCompletedActivitiesInput = z.infer<typeof getCompletedActivitiesSchema>;
