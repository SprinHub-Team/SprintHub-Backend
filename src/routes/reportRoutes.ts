import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { controllers } from '../dependencies/controllerDependency';

const reportController = controllers.report;

const router = Router();

router.use(requireAuth);

router.get('/groups/:groupId', reportController.getGroupPerformance.bind(reportController));
router.get('/users/:userId', reportController.getUserPerformance.bind(reportController));
router.get('/groups/:groupId/completed', reportController.getCompletedActivities.bind(reportController));

export default router;
