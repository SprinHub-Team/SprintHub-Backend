import { SprintResponse } from '../dtos/response/sprintResponseDto';
import { ISprint } from '../models/Sprint';

export class SprintMapper {

  public static toResponse(sprint: ISprint): SprintResponse {
    return {
      id: sprint._id.toString(),
      name: sprint.name,
      goal: sprint.goal || '',
      startDate: new Date(sprint.startDate).toISOString(),
      endDate: new Date(sprint.endDate).toISOString(),
      status: sprint.status ?? 'planificado',
      groupId: sprint.groupId.toString(),
      createdAt: sprint.createdAt ? new Date(sprint.createdAt).toISOString() : new Date(0).toISOString(),
      updatedAt: sprint.updatedAt ? new Date(sprint.updatedAt).toISOString() : new Date(0).toISOString(),
    };
  }

}