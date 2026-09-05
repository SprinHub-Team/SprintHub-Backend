import { ReportRepository } from "../repository/ReportRepository";
import AppError from "../errors/AppError";

export class ReportService {
  constructor(private reportRepository: ReportRepository) {}

  async getGroupPerformance(groupId: string) {
    if (!groupId) {
      throw new AppError("El ID del grupo es requerido", 400);
    }
    return this.reportRepository.getGroupPerformance(groupId);
  }

  async getUserPerformance(userId: string, startDate?: string, endDate?: string) {
    if (!userId) {
      throw new AppError("El ID del usuario es requerido", 400);
    }
    return this.reportRepository.getUserPerformance(userId, startDate, endDate);
  }
  
  async getCompletedActivities(groupId: string) {
    if (!groupId) {
      throw new AppError("El ID del grupo es requerido", 400);
    }
    return this.reportRepository.getCompletedActivities(groupId);
  }
}
