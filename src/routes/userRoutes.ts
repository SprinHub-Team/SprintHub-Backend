import { Router } from 'express';
import { controllers } from '../dependencies/controllerDependency';
import { requireAuth } from '../middlewares/authMiddleware';

const userController = controllers.user;
const router = Router();

router.use(requireAuth);


router.get('/', userController.getAllUsers.bind(userController));
router.get('/me', userController.getUserById.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));
router.delete('/:id', userController.deleteUser.bind(userController));

export default router;