import bcrypt from 'bcrypt';
import { UserRepository } from '../repository/userRepository';
import AppError from '../errors/AppError';

export class UserService {
  constructor(private userRepo = new UserRepository()) {}

  async createUser(data: { name: string; email: string; documentId: string; password: string }) {
    const emailTaken = await this.userRepo.findByEmail(data.email);
    if (emailTaken) throw new AppError('El email ya está registrado', 409);

    const docTaken = await this.userRepo.findByDocumentId(data.documentId);
    if (docTaken) throw new AppError('El documento ya está registrado', 409);

    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.userRepo.create({ ...data, passwordHash });
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new AppError('Usuario no encontrado', 404);
    return user;
  }

  async updateUser(id: string, data: { name?: string; email?: string }) {
    const exists = await this.userRepo.existById(id);
    if (!exists) throw new AppError('Usuario no encontrado', 404);
    return this.userRepo.update(id, data);
  }

  async deleteUser(id: string) {
    const exists = await this.userRepo.existById(id);
    if (!exists) throw new AppError('Usuario no encontrado', 404);
    return this.userRepo.delete(id);
  }
}