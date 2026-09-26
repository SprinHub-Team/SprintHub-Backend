import { GroupRepository } from '../repository/groupRepository';
import { UserRepository } from '../repository/userRepository';
import AppError from '../errors/AppError';
import { GroupResponse } from '../dtos/response/groupResponseDto';
import { GroupMapper } from '../mappers/groupMapper';
import { AddGroupMemberInput, CreateGroupInput, RemoveGroupMemberInput, UpdateGroupInput, UpdateGroupMemberRoleInput } from '../dtos/input/groupInputDto';
import CloudinaryStorageService from './storage/cloudinaryStorageService';
import { BoardRepository } from '../repository/boardRepository';

export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly boardRepository: BoardRepository,
    private readonly cloudinaryService: CloudinaryStorageService
  ) {}

    async getGroupsForUser(userId: string): Promise<GroupResponse[]> {
      
    const userExists = await this.userRepository.existById(userId);
    if (!userExists) throw new AppError('Usuario no encontrado', 404);

    const groups = await this.groupRepository.findByUserId(userId);
      
    return groups.map(group => GroupMapper.toResponse(group));

  }

  async getGroupById(groupId: string, userId: string): Promise<GroupResponse> {

    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      groupId,
      userId,
      ['admin', 'collaborator'],
      );

    if(!hasPermission){
          throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
    }

    const group = await this.groupRepository.findById(groupId);
    if (!group) throw new AppError('El grupo buscado no existe', 404);

    return GroupMapper.toResponse(group);

  }

  async createGroup(data: CreateGroupInput, userId: string): Promise<GroupResponse> {

    let profilePicture = undefined;

    if(data.filePicture){
      
      profilePicture = await this.cloudinaryService.upload({...data.filePicture, path: 'GroupImages' });

    }

      const group = await this.groupRepository.create({name: data.name, description: data.description, ...(profilePicture && {profilePicture}), ownerId: userId});
      const result = await this.groupRepository.addMember(group._id.toString(), userId, 'admin');

      if(!result){

        if(profilePicture){
          await this.cloudinaryService.delete(profilePicture.path);
        }

        await this.groupRepository.delete(group._id.toString());

        throw new AppError('No se ha podido crear el grupo.', 400);
      }

      return GroupMapper.toResponse(result);

  }

 async updateGroup(data: UpdateGroupInput, userId: string): Promise<GroupResponse> {
    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      data.groupId,
      userId,
      ['admin']
    );

    if (!hasPermission) {
      throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
    }

    let profilePicture = undefined;
    let currentPhotoPath: string | undefined = undefined;

    if (data.filePicture) {
      const currentGroup = await this.groupRepository.findById(data.groupId);
      currentPhotoPath = currentGroup?.profilePicture?.path;

      profilePicture = await this.cloudinaryService.upload({
        ...data.filePicture,
        path: 'GroupImages'
      });
    }

    const updatePayload = {
      name: data.name,
      description: data.description,
      ...(profilePicture && { profilePicture })
    };

    const group = await this.groupRepository.update(data.groupId, updatePayload);

    if (!group) {
      
      if (profilePicture) {
        await this.cloudinaryService.delete(profilePicture.path);
      }

      throw new AppError('No se ha podido actualizar el grupo o el grupo no existe', 404);
    }

    if (currentPhotoPath) {
      this.cloudinaryService.delete(currentPhotoPath).catch((err) => {
        console.error(err);
      });
    }

    return GroupMapper.toResponse(group);
  }


  async deleteGroup(groupId: string, userId: string): Promise<void> {

    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      groupId,
      userId,
      ['admin'],
      );

    if(!hasPermission){
          throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
    }

    const currentGroup = await this.groupRepository.findById(groupId);
    const currentPhotoPath = currentGroup?.profilePicture?.path;

    const cardsFilePaths = await this.boardRepository.getCardFilesPathByGroupId(groupId);

    const isDeleted = await this.groupRepository.delete(groupId);

    if(!isDeleted){
      throw new AppError('No se ha podido eliminar el grupo', 400);
    }

    if(cardsFilePaths.length > 1)
    await this.cloudinaryService.deleteMany(cardsFilePaths);

    if(currentPhotoPath){
      await this.cloudinaryService.delete(currentPhotoPath);
    }

  }

  async addMember(data: AddGroupMemberInput, userId: string): Promise<GroupResponse> {

    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      data.groupId,
      userId,
      ['admin'],
      );

    if(!hasPermission){
          throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
    }

    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new AppError('El usuario relacionado no existe', 404);

    const alreadyMember = await this.groupRepository.isMember(
      data.groupId,
      user._id.toString(),
    );
    if (alreadyMember)
      throw new AppError('El usuario ya pertenece al grupo', 409);

    const group = await this.groupRepository.addMember(data.groupId, user._id.toString(), data.role);

    if(!group){
      throw new AppError('No se ha podido añadir el miembro al grupo o el grupo no existe', 404);
    }

    return GroupMapper.toResponse(group);

  }

  async removeMember(data: RemoveGroupMemberInput, userId: string): Promise<GroupResponse> {

    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      data.groupId,
      userId,
      ['admin'],
      );

    if(!hasPermission){
          throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
    }

    const isMember = await this.groupRepository.isMember(data.groupId, data.userId);
    if (!isMember) throw new AppError('El usuario no pertenece al grupo', 404);

    const group = await this.groupRepository.removeMember(data.groupId, data.userId);

    if(!group){
      throw new AppError('No se ha podido remover el miembro del grupo o el grupo no existe', 404);
    }

    return GroupMapper.toResponse(group);
  }

  async updateMemberRole(data: UpdateGroupMemberRoleInput, userId: string): Promise<GroupResponse> {

    const hasPermission = await this.groupRepository.isMemberAndRoleValid(
      data.groupId,
      userId,
      ['admin'],
      );

    if(!hasPermission){
          throw new AppError('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
    }

    const groupExists = await this.groupRepository.existById(data.groupId);
    if (!groupExists) throw new AppError('Grupo no encontrado', 404);

    const isMember = await this.groupRepository.isMember(data.groupId, userId);
    if (!isMember) throw new AppError('El usuario no pertenece al grupo', 404);

    const group = await this.groupRepository.updateMemberRole(data.groupId, data.userId, data.role);

    if(!group){
      throw new AppError('No se ha podido actualizar el miembro del grupo o el grupo no existe', 404);
    }

    return GroupMapper.toResponse(group);

  }

}
