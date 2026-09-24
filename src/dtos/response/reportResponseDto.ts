export interface GroupPerformanceResponse {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  topUsers?: any[];
}

export interface UserPerformanceResponse {
  userId: string;
  totalAssigned: number;
  completed: number;
  pending: number;
}

export interface CompletedActivitiesResponse {
  activities: any[];
}
