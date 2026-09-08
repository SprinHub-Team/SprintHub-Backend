"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupController = void 0;
const GroupDto_1 = require("../dtos/GroupDto");
const AppError_1 = __importDefault(require("../errors/AppError"));
class GroupController {
    groupService;
    userRepository;
    constructor(groupService, userRepository) {
        this.groupService = groupService;
        this.userRepository = userRepository;
    }
    async createGroup(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: "No autorizado" });
                return;
            }
            const validation = GroupDto_1.createGroupSchema.safeParse(req.body);
            if (!validation.success) {
                res
                    .status(400)
                    .json({
                    message: "Datos inválidos",
                    errors: validation.error.format(),
                });
                return;
            }
            const newGroup = await this.groupService.createGroup({
                ...validation.data,
                ownerId: userId,
            });
            res
                .status(201)
                .json({ message: "Grupo creado exitosamente", group: newGroup });
        }
        catch (error) {
            res
                .status(error.statusCode || 500)
                .json({ message: error.message || "Error al crear el grupo" });
        }
    }
    async addMember(req, res) {
        try {
            const groupId = req.params.groupId;
            const reqUserId = req.user?.userId;
            if (!reqUserId) {
                res.status(401).json({ message: "No autorizado" });
                return;
            }
            const validation = GroupDto_1.addMemberSchema.safeParse(req.body);
            if (!validation.success) {
                res
                    .status(400)
                    .json({
                    message: "Datos inválidos",
                    errors: validation.error.format(),
                });
                return;
            }
            // Verify requester is admin or collaborator
            const group = await this.groupService.getGroupById(groupId);
            const requester = group.members.find((m) => m.user._id?.toString() === reqUserId ||
                m.user.toString() === reqUserId);
            if (!requester ||
                (requester.role !== "admin" && requester.role !== "collaborator")) {
                throw new AppError_1.default("Solo los administradores o colaboradores pueden agregar miembros al grupo", 403);
            }
            const userToAdd = await this.userRepository.findByEmail(validation.data.email);
            if (!userToAdd) {
                throw new AppError_1.default("Usuario a agregar no encontrado", 404);
            }
            const updatedGroup = await this.groupService.addMember(groupId, userToAdd._id.toString(), validation.data.role);
            res.json({
                message: "Miembro agregado exitosamente",
                group: updatedGroup,
            });
        }
        catch (error) {
            res
                .status(error.statusCode || 500)
                .json({ message: error.message || "Error al agregar miembro" });
        }
    }
    async getMyGroups(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: "No autorizado" });
                return;
            }
            const groups = await this.groupService.getGroupsForUser(userId);
            res.json(groups);
        }
        catch (error) {
            res
                .status(error.statusCode || 500)
                .json({ message: error.message || "Error al obtener grupos" });
        }
    }
    async deleteGroup(req, res) {
        try {
            const groupId = req.params.groupId;
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({ message: "No autorizado" });
                return;
            }
            // Verify requester is admin
            const group = await this.groupService.getGroupById(groupId);
            const requester = group.members.find((m) => m.user._id?.toString() === userId || m.user.toString() === userId);
            if (!requester || requester.role !== "admin") {
                throw new AppError_1.default("Solo los administradores pueden eliminar el grupo", 403);
            }
            await this.groupService.deleteGroup(groupId);
            res.json({ message: "Grupo eliminado exitosamente" });
        }
        catch (error) {
            res
                .status(error.statusCode || 500)
                .json({ message: error.message || "Error al eliminar el grupo" });
        }
    }
    async getGroupById(req, res) {
        try {
            const { id } = req.params;
            const group = await this.groupService.getGroupById(id);
            if (!group) {
                return res.status(404).json({ message: 'Grupo no encontrado' });
            }
            return res.status(200).json(group);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.GroupController = GroupController;
