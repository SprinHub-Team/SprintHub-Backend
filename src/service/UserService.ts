import { UserRepository } from '../repository/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { LoginDto } from '../dtos/UserDto';
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

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

}