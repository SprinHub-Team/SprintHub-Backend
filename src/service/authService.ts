import { AuthLoginResponse, AuthRegisterResponse } from '../dtos/response/authResponseDto';
import { LoginInput, RegisterInput } from '../dtos/input/authInputDto';
import { UserRepository } from '../repository/userRepository';
import { JwtPayload } from '../utils/JwtPayload';
import { AuthMapper } from '../mappers/authMapper';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from '../config/env';


export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(data: RegisterInput): Promise<AuthRegisterResponse> {

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

    return AuthMapper.toAuthRegisterResponse(newUser);
  }

  async login(data: LoginInput): Promise<AuthLoginResponse> {

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

    return AuthMapper.toAuthLoginResponse(user, token);

  }
}