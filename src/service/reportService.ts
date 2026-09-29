import { ReportRepository } from '../repository/reportRepository';
import { GroupRepository } from '../repository/groupRepository';
import {
  GroupPerformanceResponse,
  UserPerformanceResponse,
  CompletedActivityResponse,
} from '../dtos/response/reportResponseDto';
import { GetUserPerformanceInput } from '../dtos/input/reportInputDto';
import { ReportMapper } from '../mappers/reportMapper';
import AppError from '../errors/AppError';
export class ReportService {
  
  constructor(
    private reportRepository: ReportRepository,
    private readonly groupRepository: GroupRepository
  ) {}
  
  async getGroupPerformance(groupId: string, userId: string): Promise<GroupPerformanceResponse> {
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      groupId,
      userId,
      ['admin', 'collaborator'],
    );
    if (!hasPermission) {
      throw new AppError('El usuario no tiene permiso para consultar este reporte o el grupo no existe', 403);
    }
    const data = await this.reportRepository.getGroupPerformance(groupId);
    return ReportMapper.toGroupPerformanceResponse(data);
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
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      groupId,
      userId,
      ['admin', 'collaborator'],
    );
    if (!hasPermission) {
      throw new AppError('El usuario no tiene permiso para consultar este reporte o el grupo no existe', 403);
    }
    const cards = await this.reportRepository.getCompletedActivities(groupId);
    return ReportMapper.toCompletedActivitiesResponse(cards);
  }

}