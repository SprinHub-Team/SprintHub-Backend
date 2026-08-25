import { Router } from 'express';
import { createGroup, addMember, getMyGroups } from '../controllers/groupController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

// Todas las rutas de grupos requieren autenticación
router.use(requireAuth);

router.post('/', createGroup);
router.get('/', getMyGroups);
router.post('/:groupId/members', addMember);

export default router;
