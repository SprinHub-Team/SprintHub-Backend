import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Ejemplo de ruta protegida para obtener el perfil (opcional, pero útil)
router.get('/me', requireAuth, (req, res) => {
  res.json({ message: 'Ruta protegida', user: (req as any).user });
});

export default router;
