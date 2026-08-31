import { GroupRepository } from '../repository/groupRepository';
import { UserRepository } from '../repository/userRepository';
import AppError from '../errors/AppError';

export class GroupService {
  constructor(
    private groupRepo = new GroupRepository(),
    private userRepo = new UserRepository()
  ) {}

  async createGroup(data: { name: string; description?: string; ownerId: string }) {
    const ownerExists = await this.userRepo.existById(data.ownerId);
    if (!ownerExists) throw new AppError('El usuario propietario no existe', 400);

    const group = await this.groupRepo.create(data);
    return this.groupRepo.addMember(group._id.toString(), data.ownerId, 'admin');
  }

  async getGroupById(id: string) {
    const group = await this.groupRepo.findById(id);
    if (!group) throw new AppError('Grupo no encontrado', 404);
    return group;
  }

  async getGroupsForUser(userId: string) {
    const userExists = await this.userRepo.existById(userId);
    if (!userExists) throw new AppError('Usuario no encontrado', 404);
    return this.groupRepo.findByUserId(userId);
  }

  async addMember(groupId: string, userId: string, role: 'admin' | 'collaborator' | 'visitor') {
    const groupExists = await this.groupRepo.existById(groupId);
    if (!groupExists) throw new AppError('Grupo no encontrado', 404);

    const userExists = await this.userRepo.existById(userId);
    if (!userExists) throw new AppError('Usuario no encontrado', 404);

    const alreadyMember = await this.groupRepo.isMember(groupId, userId);
    if (alreadyMember) throw new AppError('El usuario ya pertenece al grupo', 409);

    return this.groupRepo.addMember(groupId, userId, role);
  }

  async removeMember(groupId: string, userId: string) {
    const isMember = await this.groupRepo.isMember(groupId, userId);
    if (!isMember) throw new AppError('El usuario no pertenece al grupo', 404);

    return this.groupRepo.removeMember(groupId, userId);
  }

  async deleteGroup(id: string) {
    const exists = await this.groupRepo.existById(id);
    if (!exists) throw new AppError('Grupo no encontrado', 404);
    return this.groupRepo.delete(id);
  }
}