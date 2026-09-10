import { Router } from 'express';
import { authController } from '../dependencies/authDependency';

const router = Router();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));

export default router;