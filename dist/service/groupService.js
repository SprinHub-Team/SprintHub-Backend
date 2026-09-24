"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const AppError_1 = __importDefault(require("../errors/AppError"));
const groupMapper_1 = require("../mappers/groupMapper");
class GroupService {
    groupRepository;
    userRepository;
    boardRepository;
    cloudinaryService;
    constructor(groupRepository, userRepository, boardRepository, cloudinaryService) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.boardRepository = boardRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async getGroupsForUser(userId) {
        const userExists = await this.userRepository.existById(userId);
        if (!userExists)
            throw new AppError_1.default('Usuario no encontrado', 404);
        const groups = await this.groupRepository.findByUserId(userId);
        return groups.map(group => groupMapper_1.GroupMapper.toResponse(group));
    }
    async getGroupById(groupId, userId) {
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(groupId, userId, ['admin', 'collaborator']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }
        const group = await this.groupRepository.findById(groupId);
        if (!group)
            throw new AppError_1.default('El grupo buscado no existe', 404);
        return groupMapper_1.GroupMapper.toResponse(group);
    }
    async createGroup(data, userId) {
        let profilePicture;
        if (data.filePicture) {
            profilePicture = await this.cloudinaryService.upload({ ...data.filePicture, path: 'GroupImages' });
        }
        const group = await this.groupRepository.create({ name: data.name, description: data.description, profilePicture, ownerId: userId });
        const result = await this.groupRepository.addMember(group._id.toString(), userId, 'admin');
        if (!result) {
            if (profilePicture) {
                await this.cloudinaryService.delete(profilePicture.path);
            }
            await this.groupRepository.delete(group._id.toString());
            throw new AppError_1.default('No se ha podido crear el grupo.', 400);
        }
        return groupMapper_1.GroupMapper.toResponse(result);
    }
    async updateGroup(data, userId) {
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(data.groupId, userId, ['admin']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }
        if (data.filePicture) {
            const profilePicture = await this.cloudinaryService.upload({ ...data.filePicture, path: 'GroupImages' });
            const currentGroup = await this.groupRepository.findById(data.groupId);
            const currentPhotoPath = currentGroup?.profilePicture?.path;
            const group = await this.groupRepository.update(data.groupId, { name: data.name, description: data.description, profilePicture });
            if (!group) {
                if (profilePicture) {
                    await this.cloudinaryService.delete(profilePicture.path);
                }
                throw new AppError_1.default('No se ha podido actualizar el grupo o el grupo no existe', 404);
            }
            if (currentPhotoPath) {
                await this.cloudinaryService.delete(currentPhotoPath);
            }
            return groupMapper_1.GroupMapper.toResponse(group);
        }
        const group = await this.groupRepository.update(data.groupId, { name: data.name, description: data.description });
        if (!group) {
            throw new AppError_1.default('No se ha podido actualizar el grupo o el grupo no existe', 404);
        }
        return groupMapper_1.GroupMapper.toResponse(group);
    }
    async deleteGroup(groupId, userId) {
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(groupId, userId, ['admin']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }
        const currentGroup = await this.groupRepository.findById(groupId);
        const currentPhotoPath = currentGroup?.profilePicture?.path;
        const cardsFilePaths = await this.boardRepository.getCardFilesPathByGroupId(groupId);
        const isDeleted = await this.groupRepository.delete(groupId);
        if (!isDeleted) {
            throw new AppError_1.default('No se ha podido eliminar el grupo', 400);
        }
        if (cardsFilePaths.length > 1)
            await this.cloudinaryService.deleteMany(cardsFilePaths);
        if (currentPhotoPath) {
            await this.cloudinaryService.delete(currentPhotoPath);
        }
    }
    async addMember(data, userId) {
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(data.groupId, userId, ['admin']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }
        const user = await this.userRepository.findByEmail(data.email);
        if (!user)
            throw new AppError_1.default('El usuario relacionado no existe', 404);
        const alreadyMember = await this.groupRepository.isMember(data.groupId, user._id.toString());
        if (alreadyMember)
            throw new AppError_1.default('El usuario ya pertenece al grupo', 409);
        const group = await this.groupRepository.addMember(data.groupId, user._id.toString(), data.role);
        if (!group) {
            throw new AppError_1.default('No se ha podido añadir el miembro al grupo o el grupo no existe', 404);
        }
        return groupMapper_1.GroupMapper.toResponse(group);
    }
    async removeMember(data, userId) {
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(data.groupId, userId, ['admin']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }
        const isMember = await this.groupRepository.isMember(data.groupId, data.userId);
        if (!isMember)
            throw new AppError_1.default('El usuario no pertenece al grupo', 404);
        const group = await this.groupRepository.removeMember(data.groupId, data.userId);
        if (!group) {
            throw new AppError_1.default('No se ha podido remover el miembro del grupo o el grupo no existe', 404);
        }
        return groupMapper_1.GroupMapper.toResponse(group);
    }
    async updateMemberRole(data, userId) {
        const hasPermission = await this.groupRepository.isMemberAndRoleValid(data.groupId, userId, ['admin']);
        if (!hasPermission) {
            throw new AppError_1.default('El usuario no tiene permiso para realizar esta acción o el grupo no existe', 403);
        }
        const groupExists = await this.groupRepository.existById(data.groupId);
        if (!groupExists)
            throw new AppError_1.default('Grupo no encontrado', 404);
        const isMember = await this.groupRepository.isMember(data.groupId, userId);
        if (!isMember)
            throw new AppError_1.default('El usuario no pertenece al grupo', 404);
        const group = await this.groupRepository.updateMemberRole(data.groupId, data.userId, data.role);
        if (!group) {
            throw new AppError_1.default('No se ha podido actualizar el miembro del grupo o el grupo no existe', 404);
        }
        return groupMapper_1.GroupMapper.toResponse(group);
    }
}
exports.GroupService = GroupService;
