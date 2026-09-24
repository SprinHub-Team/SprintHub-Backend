import { ISprint } from '../models/Sprint';
import { SprintResponse } from '../dtos/response/sprintResponseDto';

export class SprintMapper {
  public static toResponse(sprint: ISprint): SprintResponse {
    return {
      id: sprint._id.toString(),
      name: sprint.name,
      goal: sprint.goal || undefined,
      startDate: sprint.startDate.toISOString(),
      endDate: sprint.endDate.toISOString(),
      status: sprint.status as 'planificado' | 'activo' | 'completado',
      groupId: sprint.groupId.toString(),
      createdAt: sprint.createdAt.toISOString(),
      updatedAt: sprint.updatedAt.toISOString(),
    };
  }
}
