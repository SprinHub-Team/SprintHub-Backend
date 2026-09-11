import { Request, Response } from 'express';
import { UserService } from '../service/userService';
import { mongoIdSchema } from '../utils/idValidator';

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response) {
    try {
      const newUser = await this.userService.createUser(req.body);
      return res.status(201).json(newUser);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const userId = mongoIdSchema.parse(req.params.id);

      const user = await this.userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = mongoIdSchema.parse(req.params.id);

      const updatedUser = await this.userService.updateUser(
        userId,
        req.body
      );

      return res.status(200).json(updatedUser);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = mongoIdSchema.parse(req.params.id);

      const deletedUser = await this.userService.deleteUser(userId);

      return res.status(200).json({
        message: 'Usuario eliminado',
        data: deletedUser,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}
