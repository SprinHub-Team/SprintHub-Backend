import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../service/reportService';
import {
  getGroupPerformanceInputSchema,
  getUserPerformanceInputSchema,
  getCompletedActivitiesInputSchema,
} from '../dtos/input/reportInputDto';

export class ReportController {

  constructor(private reportService: ReportService) {}

  async getGroupPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const { groupId } = getGroupPerformanceInputSchema.parse(req.params);
      const data = await this.reportService.getGroupPerformance(groupId, userId);
      return res.status(200).json({
        message: 'Rendimiento del grupo consultado correctamente',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const requesterId = req.user.userId;
      const data = getUserPerformanceInputSchema.parse({
        userId: req.params.userId,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      });
      const result = await this.reportService.getUserPerformance(data, requesterId);
      return res.status(200).json({
        message: 'Rendimiento del usuario consultado correctamente',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompletedActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const { groupId } = getCompletedActivitiesInputSchema.parse(req.params);
      const data = await this.reportService.getCompletedActivities(groupId, userId);
      return res.status(200).json({
        message: 'Actividades finalizadas consultadas correctamente',
        data
      });
    } catch (error) {
      next(error);
    }
  }

}