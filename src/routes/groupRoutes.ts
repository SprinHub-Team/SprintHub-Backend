import { Router } from 'express';
import { controllers } from '../dependencies/controllerDependency'; 
import { requireAuth } from '../middlewares/authMiddleware';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';


const groupController = controllers.group;

const router = Router();

router.use(requireAuth);

router.post('/', groupController.createGroup.bind(groupController));
router.get('/', groupController.getMyGroups.bind(groupController));
router.get('/:id', groupController.getGroupById.bind(groupController));
router.post('/:groupId/members', groupController.addMember.bind(groupController));
router.put('/:id/members/:userId', groupController.updateMemberRole.bind(groupController));
router.delete('/:id/members/:userId', groupController.removeMember.bind(groupController));
router.put('/:id', groupController.updateGroup.bind(groupController));
router.post('/:id/profile-picture', uploadMiddleware.single('file'), groupController.uploadProfilePicture.bind(groupController));
router.delete('/:id', groupController.deleteGroup.bind(groupController));

export default router;