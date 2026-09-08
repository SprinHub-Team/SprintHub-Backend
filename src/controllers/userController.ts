import { Request, Response } from 'express';
import { UserService } from '../service/userService';

export class UserController {
  constructor(private userService: UserService) {}

  // Crear un nuevo usuario
  async createUser(req: Request, res: Response) {
    try {
      // Nota: Asegúrate de que tu UserService tenga un método llamado createUser
      const newUser = await this.userService.createUser(req.body);
      return res.status(201).json(newUser);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // Obtener todos los usuarios
  async getAllUsers(req: Request, res: Response) {
    try {
      // Nota: Asegúrate de que tu UserService tenga un método llamado getAllUsers
      const users = await this.userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // Obtener un usuario por su ID
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Nota: Asegúrate de que tu UserService tenga un método llamado getUserById
      const user = await this.userService.getUserById(id as string);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // Actualizar un usuario
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedUser = await this.userService.updateUser(id as string, req.body);
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // Eliminar un usuario
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedUser = await this.userService.deleteUser(id as string);
      return res.status(200).json({ message: 'Usuario eliminado', data: deletedUser });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}