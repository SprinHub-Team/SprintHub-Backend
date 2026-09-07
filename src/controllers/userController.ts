import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { UserService } from '../service/userService';

const userService = new UserService();

export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    const user = await userService.getUserById(userId);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      documentId: user.documentId,
      role: user.role
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error al obtener perfil' });
  }
};
