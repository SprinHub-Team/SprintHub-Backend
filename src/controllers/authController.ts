import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import env from '../config/env';
import { createUserSchema, loginSchema } from '../dtos/UserDto';
import { UserRepository } from '../repository/UserRepository';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validación con Zod
    const validation = createUserSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ message: 'Errores de validación', errors: validation.error.format() });
      return;
    }

    const { name, email, documentId, password } = validation.data;

    // Verificar si el usuario ya existe
    const existingEmail = await UserRepository.findByEmail(email);
    const existingDoc = await UserRepository.findByDocumentId(documentId);
    if (existingEmail || existingDoc) {
      res.status(400).json({ message: 'El correo o documento ya están registrados' });
      return;
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario
    await UserRepository.create({ name, email, documentId, passwordHash });

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al registrar usuario' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ message: 'Credenciales inválidas', errors: validation.error.format() });
      return;
    }

    const { email, password } = validation.data;

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Credenciales incorrectas' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Credenciales incorrectas' });
      return;
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      env.jwtsecret || 'secret',
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Sesión iniciada correctamente',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
  }
};
