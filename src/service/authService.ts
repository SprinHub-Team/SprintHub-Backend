import { UserRepository } from '../repository/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(data: any) {
    const { name, email, password } = data;

    if (!name || !email || !password) {
      throw new Error('Nombre, email y contraseña son obligatorios');
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await this.userRepository.create({
      name,
      email,
      documentId: data.documentId || String(Date.now()),
      passwordHash: hashedPassword,
      password: hashedPassword,
    } as any);

    return {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
  }

  async login(data: any) {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error('Email y contraseña son obligatorios');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const hash = (user as any).passwordHash || (user as any).password;
    if (!hash) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, hash);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const env = require('../config/env').default;
    const secret = env.jwtsecret || 'secret';
    const token = jwt.sign(
      { userId: user._id, role: (user as any).role || 'user' }, 
      secret, 
      { expiresIn: '1d' } // El token expira en 1 día
    );

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}