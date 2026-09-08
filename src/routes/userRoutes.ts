import { Router } from 'express';
// Asegúrate de importar la instancia desde userDependency, NO la clase desde controllers
import { userController } from '../dependencies/userDependency';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

// Usa funciones flecha (req, res) => ... para cada ruta
router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/me', requireAuth, (req, res) => {
  if ((req as any).user) {
    userController.getUserById({ ...req, params: { id: (req as any).user.userId } } as any, res);
  } else {
    res.status(401).json({ message: 'No autorizado' });
  }
});
router.get('/:id', (req, res) => userController.getUserById(req, res));
router.post('/', (req, res) => userController.createUser(req, res));

export default router;