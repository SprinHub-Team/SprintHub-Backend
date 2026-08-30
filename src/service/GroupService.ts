// import { CreateGroupDto, AddMemberDto } from '../dtos/GroupDto';
// import { GroupRepository } from '../repository/GroupRepository';
// import { UserRepository } from '../repository/UserRepository';
// import AppError from '../errors/AppError';
// import { IGroup } from '../models/Group';

// export class GroupService {
//   constructor(
//     private groupRepository: GroupRepository,
//     // Note: Since UserRepository is a plain object in your code, we can import it directly,
//     // but passing it in the constructor allows DI if you ever change it to a class.
//     private userRepository = UserRepository
//   ) {}

//   async createGroup(userId: string, data: CreateGroupDto): Promise<IGroup> {

//     const groupData: Partial<IGroup> = {
//       name: data.name,
//       description: data.description,
//       ownerId: userId,
//       members: [{ user: userId, role: 'admin' as const }]
//     };

//     return this.groupRepository.create(groupData);
//   }

//   async getMyGroups(userId: string): Promise<IGroup[]> {
//     const userObjectId = toObjectId(userId, 'ID de usuario inválido');
//     return this.groupRepository.findByUserId(userObjectId);
//   }

//   async addMember(userId: string, groupId: string, data: AddMemberDto): Promise<IGroup> {
//     const groupObjectId = toObjectId(groupId, 'ID de grupo inválido');
//     const group = await this.groupRepository.findById(groupObjectId);

//     if (!group) {
//       throw new AppError('Grupo no encontrado', 404);
//     }

//     const requesterMember = group.members.find(m => m.user._id.toString() === userId || m.user.toString() === userId);
//     if (!requesterMember || requesterMember.role !== 'admin') {
//       throw new AppError('Solo los administradores pueden agregar miembros al grupo', 403);
//     }

//     const userToAdd = await this.userRepository.findByEmail(data.email);
//     if (!userToAdd) {
//       throw new AppError('Usuario a agregar no encontrado', 404);
//     }

//     const isAlreadyMember = group.members.some(m => m.user._id.toString() === userToAdd._id.toString() || m.user.toString() === userToAdd._id.toString());
//     if (isAlreadyMember) {
//       throw new AppError('El usuario ya pertenece al grupo', 400);
//     }

//     const updatedGroup = await this.groupRepository.addMember(groupObjectId, userToAdd._id, data.role);
//     if (!updatedGroup) {
//       throw new AppError('Error al agregar miembro', 500);
//     }
//     return updatedGroup;
//   }

//   async deleteGroup(userId: string, groupId: string): Promise<void> {
//     const groupObjectId = toObjectId(groupId, 'ID de grupo inválido');
//     const group = await this.groupRepository.findById(groupObjectId);

//     if (!group) {
//       throw new AppError('Grupo no encontrado', 404);
//     }

//     const requesterMember = group.members.find(m => m.user._id.toString() === userId || m.user.toString() === userId);
//     if (!requesterMember || requesterMember.role !== 'admin') {
//       throw new AppError('Solo los administradores pueden eliminar el grupo', 403);
//     }

//     await this.groupRepository.delete(groupObjectId);
//   }
// }
