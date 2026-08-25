import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';

// Extender la interfaz Request para incluir el usuario decodificado
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtsecret || 'secret') as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
    return;
  }
  next();
};
