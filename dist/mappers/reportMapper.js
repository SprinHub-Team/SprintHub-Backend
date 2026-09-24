"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportMapper = void 0;
class ReportMapper {
    static toGroupPerformanceResponse(data) {
        return {
            totalTasks: data.totalTasks || 0,
            completedTasks: data.completedTasks || 0,
            pendingTasks: data.pendingTasks || 0,
            completionRate: data.completionRate || 0,
            topUsers: data.topUsers || [],
        };
    }
    static toUserPerformanceResponse(data) {
        return {
            userId: data.userId || '',
            totalAssigned: data.totalAssigned || 0,
            completed: data.completed || 0,
            pending: data.pending || 0,
        };
    }
    static toCompletedActivitiesResponse(data) {
        return {
            activities: data.activities || data || [],
        };
    }
}
exports.ReportMapper = ReportMapper;
