import { Router } from 'express';
import { getMyProfile } from '../controllers/userController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/me', getMyProfile);

export default router;
