import { Router } from 'express';
import { controllers } from '../dependencies/controllerDependency';

const authController = controllers.auth;

const router = Router();

router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));

export default router;