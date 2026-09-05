"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroup = exports.getMyGroups = exports.addMember = exports.createGroup = void 0;
const GroupService_1 = require("../service/GroupService");
const GroupRepository_1 = require("../repository/GroupRepository");
const UserRepository_1 = require("../repository/UserRepository");
const GroupDto_1 = require("../dtos/GroupDto");
const AppError_1 = __importDefault(require("../errors/AppError"));
const groupService = new GroupService_1.GroupService(new GroupRepository_1.GroupRepository(), new UserRepository_1.UserRepository());
const userRepo = new UserRepository_1.UserRepository();
const createGroup = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        const validation = GroupDto_1.createGroupSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ message: 'Datos inválidos', errors: validation.error.format() });
            return;
        }
        const newGroup = await groupService.createGroup({ ...validation.data, ownerId: userId });
        res.status(201).json({ message: 'Grupo creado exitosamente', group: newGroup });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Error al crear el grupo' });
    }
};
exports.createGroup = createGroup;
const addMember = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const reqUserId = req.user?.userId;
        if (!reqUserId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        const validation = GroupDto_1.addMemberSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ message: 'Datos inválidos', errors: validation.error.format() });
            return;
        }
        // Verify requester is admin or collaborator
        const group = await groupService.getGroupById(groupId);
        const requester = group.members.find((m) => m.user._id?.toString() === reqUserId || m.user.toString() === reqUserId);
        if (!requester || (requester.role !== 'admin' && requester.role !== 'collaborator')) {
            throw new AppError_1.default('Solo los administradores o colaboradores pueden agregar miembros al grupo', 403);
        }
        const userToAdd = await userRepo.findByEmail(validation.data.email);
        if (!userToAdd) {
            throw new AppError_1.default('Usuario a agregar no encontrado', 404);
        }
        const updatedGroup = await groupService.addMember(groupId, userToAdd._id.toString(), validation.data.role);
        res.json({ message: 'Miembro agregado exitosamente', group: updatedGroup });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Error al agregar miembro' });
    }
};
exports.addMember = addMember;
const getMyGroups = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        const groups = await groupService.getGroupsForUser(userId);
        res.json(groups);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Error al obtener grupos' });
    }
};
exports.getMyGroups = getMyGroups;
const deleteGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        // Verify requester is admin
        const group = await groupService.getGroupById(groupId);
        const requester = group.members.find((m) => m.user._id?.toString() === userId || m.user.toString() === userId);
        if (!requester || requester.role !== 'admin') {
            throw new AppError_1.default('Solo los administradores pueden eliminar el grupo', 403);
        }
        await groupService.deleteGroup(groupId);
        res.json({ message: 'Grupo eliminado exitosamente' });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Error al eliminar el grupo' });
    }
};
exports.deleteGroup = deleteGroup;
