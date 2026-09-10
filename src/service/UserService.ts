import { UserRepository } from '../repository/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: any) {
    if (!data.name || !data.email || !data.password) {
      throw new Error('Faltan campos obligatorios (nombre, email, contraseña)');
    }

    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    return await this.userRepository.create({
      ...data,
      passwordHash,
      password: passwordHash
    });
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  // Obtener un usuario por ID
  async getUserById(id: string) {
    if (!id) {
      throw new Error('El ID del usuario es obligatorio');
    }
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return user;
  }

  async updateUser(id: string, updateData: any) {
    if (!id) {
      throw new Error('El ID del usuario es obligatorio');
    }
    
    if (updateData.password) {
      const passwordHash = await bcrypt.hash(updateData.password, 10);
      updateData.passwordHash = passwordHash;
      updateData.password = passwordHash;
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser) {
      throw new Error('Usuario no encontrado para actualizar');
    }
    return updatedUser;
  }


  async deleteUser(id: string) {
    if (!id) {
      throw new Error('El ID del usuario es obligatorio');
    }
    const deletedUser = await this.userRepository.delete(id);
    if (!deletedUser) {
      throw new Error('Usuario no encontrado para eliminar');
    }
    return deletedUser;
  }
  async loginUser(data: any) {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error('Email y contraseña son obligatorios');
    }

    const user: any = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const hash = user.passwordHash || user.password;
    if (!hash) {
      throw new Error('El usuario no tiene una contraseña registrada');
    }

    const isValidPassword = await bcrypt.compare(password, hash);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const env = require('../config/env').default;
    const secret = env.jwtsecret || 'secret';
    const token = jwt.sign(
      { userId: user._id, role: user.role || 'user' }, 
      secret, 
      { expiresIn: '1d' }
    );

    return {
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      },
      token,
    };
  }
}