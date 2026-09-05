"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const idValidator_1 = require("../utils/idValidator");
class ReportController {
    reportService;
    constructor(reportService) {
        this.reportService = reportService;
    }
    async getGroupPerformance(req, res, next) {
        try {
            const groupId = idValidator_1.mongoIdSchema.parse(req.params.groupId);
            const data = await this.reportService.getGroupPerformance(groupId);
            return res.status(200).json({
                message: "Rendimiento del grupo consultado correctamente",
                data
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserPerformance(req, res, next) {
        try {
            const userId = idValidator_1.mongoIdSchema.parse(req.params.userId);
            const { startDate, endDate } = req.query;
            const data = await this.reportService.getUserPerformance(userId, startDate, endDate);
            return res.status(200).json({
                message: "Rendimiento del usuario consultado correctamente",
                data
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getCompletedActivities(req, res, next) {
        try {
            const groupId = idValidator_1.mongoIdSchema.parse(req.params.groupId);
            const data = await this.reportService.getCompletedActivities(groupId);
            return res.status(200).json({
                message: "Actividades finalizadas consultadas correctamente",
                data
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ReportController = ReportController;
