"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SprintMapper = void 0;
class SprintMapper {
    static toResponse(sprint) {
        return {
            id: sprint._id.toString(),
            name: sprint.name,
            goal: sprint.goal || undefined,
            startDate: sprint.startDate.toISOString(),
            endDate: sprint.endDate.toISOString(),
            status: sprint.status,
            groupId: sprint.groupId.toString(),
            createdAt: sprint.createdAt.toISOString(),
            updatedAt: sprint.updatedAt.toISOString(),
        };
    }
}
exports.SprintMapper = SprintMapper;
