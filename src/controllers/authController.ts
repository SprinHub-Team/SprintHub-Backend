import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {UserModel} from '../models/User';
import env from '../config/env';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, documentId, password } = req.body;

    // Validación simple
    if (!name || !email || !documentId || !password) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' });
      return;
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ $or: [{ email }, { documentId }] });
    if (existingUser) {
      res.status(400).json({ message: 'El correo o documento ya están registrados' });
      return;
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario (el primero podría ser admin, pero por defecto será user)
    const newUser = new UserModel({ name, email, documentId, passwordHash });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al registrar usuario' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
      return;
    }

    const user = await UserModel.findOne({ email });
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
