import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserRepository } from '../repository/userRepository';
import env from '../config/env';
import { CreateUserDto, LoginDto } from '../dtos/UserDto';
import { JwtPayload } from '../dtos/JwtPayload';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(data: CreateUserDto) {

    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error('El correo electrónico ya está registrado');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await this.userRepository.create({
      name : data.name,
      email: data.email,
      documentId: data.documentId,
      passwordHash,
    });

    return {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
  }

  async login(data: LoginDto) {

    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      userId: user._id.toString(),
      role: user.role,
    };

    const token = jwt.sign(payload, env.jwtsecret, {
      expiresIn: '1d',
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token,
    };
  }
}