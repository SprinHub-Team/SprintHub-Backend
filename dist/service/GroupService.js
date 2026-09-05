"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const GroupRepository_1 = require("../repository/GroupRepository");
const UserRepository_1 = require("../repository/UserRepository");
const AppError_1 = __importDefault(require("../errors/AppError"));
class GroupService {
    groupRepo;
    userRepo;
    constructor(groupRepo = new GroupRepository_1.GroupRepository(), userRepo = new UserRepository_1.UserRepository()) {
        this.groupRepo = groupRepo;
        this.userRepo = userRepo;
    }
    async createGroup(data) {
        const ownerExists = await this.userRepo.existById(data.ownerId);
        if (!ownerExists)
            throw new AppError_1.default('El usuario propietario no existe', 400);
        const group = await this.groupRepo.create(data);
        return this.groupRepo.addMember(group._id.toString(), data.ownerId, 'admin');
    }
    async getGroupById(id) {
        const group = await this.groupRepo.findById(id);
        if (!group)
            throw new AppError_1.default('Grupo no encontrado', 404);
        return group;
    }
    async getGroupsForUser(userId) {
        const userExists = await this.userRepo.existById(userId);
        if (!userExists)
            throw new AppError_1.default('Usuario no encontrado', 404);
        return this.groupRepo.findByUserId(userId);
    }
    async addMember(groupId, userId, role) {
        const groupExists = await this.groupRepo.existById(groupId);
        if (!groupExists)
            throw new AppError_1.default('Grupo no encontrado', 404);
        const userExists = await this.userRepo.existById(userId);
        if (!userExists)
            throw new AppError_1.default('Usuario no encontrado', 404);
        const alreadyMember = await this.groupRepo.isMember(groupId, userId);
        if (alreadyMember)
            throw new AppError_1.default('El usuario ya pertenece al grupo', 409);
        return this.groupRepo.addMember(groupId, userId, role);
    }
    async removeMember(groupId, userId) {
        const isMember = await this.groupRepo.isMember(groupId, userId);
        if (!isMember)
            throw new AppError_1.default('El usuario no pertenece al grupo', 404);
        return this.groupRepo.removeMember(groupId, userId);
    }
    async deleteGroup(id) {
        const exists = await this.groupRepo.existById(id);
        if (!exists)
            throw new AppError_1.default('Grupo no encontrado', 404);
        return this.groupRepo.delete(id);
    }
}
exports.GroupService = GroupService;
