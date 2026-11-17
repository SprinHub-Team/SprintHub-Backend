import { ReportRepository } from '../repository/reportRepository';
import { GroupRepository } from '../repository/groupRepository';
import {
  GroupPerformanceResponse,
  GroupStatisticsResponse,
  UserPerformanceResponse,
  CompletedActivityResponse,
} from '../dtos/response/reportResponseDto';
import { GetUserPerformanceInput } from '../dtos/input/reportInputDto';
import { ReportMapper } from '../mappers/reportMapper';
import AppError from '../errors/AppError';
import { profilePictureUrl } from '../utils/profilePicture';
export class ReportService {
  
  constructor(
    private reportRepository: ReportRepository,
    private readonly groupRepository: GroupRepository
  ) {}
  
  private async authorizeGroupReport(groupId: string, userId: string): Promise<void> {
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      groupId,
      userId,
      ['admin', 'collaborator'],
    );
    if (!hasPermission) {
      throw new AppError('El usuario no tiene permiso para consultar este reporte o el grupo no existe', 403);
    }
  }

  async getGroupPerformance(groupId: string, userId: string): Promise<GroupPerformanceResponse> {
    await this.authorizeGroupReport(groupId, userId);
    const data = await this.reportRepository.getGroupPerformance(groupId);
    return ReportMapper.toGroupPerformanceResponse(data);
  }

  async getGroupStatistics(groupId: string, userId: string): Promise<GroupStatisticsResponse> {
    await this.authorizeGroupReport(groupId, userId);
    const [group, breakdown] = await Promise.all([
      this.groupRepository.findById(groupId),
      this.reportRepository.getGroupBreakdown(groupId),
    ]);
    if (!group) throw new AppError('Grupo no encontrado', 404);

    const users = group.members.filter(member => member.user).map(({ user }) => {
      const id = user._id.toString();
      return {
        id,
        name: user.name,
        profilePicture: profilePictureUrl(user.profilePicture),
        ...(breakdown.byUser.get(id) ?? { created: 0, completed: 0, overdue: 0, pending: 0 }),
      };
    });
    users.sort((a, b) => b.completed - a.completed || a.name.localeCompare(b.name));
    return { totals: breakdown.totals, unassigned: breakdown.unassigned, users, generatedAt: new Date().toISOString() };
  }
  
  async getUserPerformance(
    data: GetUserPerformanceInput,
    requesterId: string
  ): Promise<UserPerformanceResponse> {
    if (data.userId !== requesterId) {
      throw new AppError('Solo puedes consultar tu propio rendimiento', 403);
    }
    const result = await this.reportRepository.getUserPerformance(
      data.userId,
      data.startDate,
      data.endDate
    );
    return ReportMapper.toUserPerformanceResponse(result);
  }
  
  async getCompletedActivities(groupId: string, userId: string): Promise<CompletedActivityResponse[]> {
    await this.authorizeGroupReport(groupId, userId);
    const cards = await this.reportRepository.getCompletedActivities(groupId);
    return ReportMapper.toCompletedActivitiesResponse(cards);
  }

}
