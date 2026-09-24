import { GroupPerformanceResponse, UserPerformanceResponse, CompletedActivitiesResponse } from '../dtos/response/reportResponseDto';

export class ReportMapper {
  public static toGroupPerformanceResponse(data: any): GroupPerformanceResponse {
    return {
      totalTasks: data.totalTasks || 0,
      completedTasks: data.completedTasks || 0,
      pendingTasks: data.pendingTasks || 0,
      completionRate: data.completionRate || 0,
      topUsers: data.topUsers || [],
    };
  }

  public static toUserPerformanceResponse(data: any): UserPerformanceResponse {
    return {
      userId: data.userId || '',
      totalAssigned: data.totalAssigned || 0,
      completed: data.completed || 0,
      pending: data.pending || 0,
    };
  }

  public static toCompletedActivitiesResponse(data: any): CompletedActivitiesResponse {
    return {
      activities: data.activities || data || [],
    };
  }
}
