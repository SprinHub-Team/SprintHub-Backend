import { Router } from 'express';
// ¡IMPORTANTE! Importar desde dependencias
import { groupController } from '../dependencies/groupDependency'; 
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/', (req, res) => groupController.createGroup(req, res));
router.get('/', (req, res) => groupController.getMyGroups(req, res));
router.get('/:id', (req, res) => groupController.getGroupById(req, res));
router.post('/:groupId/members', (req, res) => groupController.addMember(req, res));
router.put('/:id/members/:userId', (req, res) => groupController.updateMemberRole(req, res));
router.delete('/:id/members/:userId', (req, res) => groupController.removeMember(req, res));
router.delete('/:groupId', (req, res) => groupController.deleteGroup(req, res));

export default router;