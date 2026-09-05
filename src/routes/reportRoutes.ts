import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { ReportRepository } from '../repository/ReportRepository';
import { ReportService } from '../service/ReportService';
import { ReportController } from '../controllers/reportController';

const reportRepository = new ReportRepository();
const reportService = new ReportService(reportRepository);
const reportController = new ReportController(reportService);

const router = Router();

router.use(requireAuth);

router.get('/groups/:groupId', reportController.getGroupPerformance.bind(reportController));
router.get('/users/:userId', reportController.getUserPerformance.bind(reportController));
router.get('/groups/:groupId/completed', reportController.getCompletedActivities.bind(reportController));

export default router;
