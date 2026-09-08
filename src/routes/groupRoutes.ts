import { Router } from 'express';
// ¡IMPORTANTE! Importar desde dependencias
import { groupController } from '../dependencies/groupDependency'; 
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/', (req, res) => groupController.createGroup(req, res));
router.get('/', (req, res) => groupController.getMyGroups(req, res));
router.get('/:id', (req, res) => groupController.getGroupById(req, res));

export default router;