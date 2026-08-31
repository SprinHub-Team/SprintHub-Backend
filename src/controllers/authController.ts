import { Request, Response } from 'express';
import { createUserSchema, loginSchema } from '../dtos/UserDto';
import { UserService } from '../service/userService';

const userService = new UserService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = createUserSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ message: 'Errores de validación', errors: validation.error.format() });
      return;
    }

    await userService.registerUser(validation.data);
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error en el servidor al registrar usuario' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ message: 'Credenciales inválidas', errors: validation.error.format() });
      return;
    }

    const result = await userService.loginUser(validation.data);
    res.json({
      message: 'Sesión iniciada correctamente',
      token: result.token,
      user: { id: result.user._id, name: result.user.name, email: result.user.email, role: result.user.role }
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error en el servidor al iniciar sesión' });
  }
};
