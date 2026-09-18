import { Router } from 'express';
import { templateController } from '../controllers/templateController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);
router.get('/', templateController.getAll.bind(templateController));

export default router;
