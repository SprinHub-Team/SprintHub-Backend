"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
class ReportService {
    reportRepository;
    constructor(reportRepository) {
        this.reportRepository = reportRepository;
    }
    async getGroupPerformance(groupId) {
        if (!groupId) {
            throw new AppError_1.default("El ID del grupo es requerido", 400);
        }
        return this.reportRepository.getGroupPerformance(groupId);
    }
    async getUserPerformance(userId, startDate, endDate) {
        if (!userId) {
            throw new AppError_1.default("El ID del usuario es requerido", 400);
        }
        return this.reportRepository.getUserPerformance(userId, startDate, endDate);
    }
    async getCompletedActivities(groupId) {
        if (!groupId) {
            throw new AppError_1.default("El ID del grupo es requerido", 400);
        }
        return this.reportRepository.getCompletedActivities(groupId);
    }
}
exports.ReportService = ReportService;
