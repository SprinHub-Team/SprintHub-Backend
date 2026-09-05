import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../service/ReportService';
import { mongoIdSchema } from '../utils/idValidator';

export class ReportController {
  constructor(private reportService: ReportService) {}

  async getGroupPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = mongoIdSchema.parse(req.params.groupId);
      const data = await this.reportService.getGroupPerformance(groupId);

      return res.status(200).json({
        message: "Rendimiento del grupo consultado correctamente",
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = mongoIdSchema.parse(req.params.userId);
      const { startDate, endDate } = req.query;

      const data = await this.reportService.getUserPerformance(
        userId, 
        startDate as string, 
        endDate as string
      );

      return res.status(200).json({
        message: "Rendimiento del usuario consultado correctamente",
        data
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getCompletedActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const groupId = mongoIdSchema.parse(req.params.groupId);
      const data = await this.reportService.getCompletedActivities(groupId);

      return res.status(200).json({
        message: "Actividades finalizadas consultadas correctamente",
        data
      });
    } catch (error) {
      next(error);
    }
  }
}
