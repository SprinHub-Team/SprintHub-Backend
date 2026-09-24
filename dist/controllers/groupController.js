"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupController = void 0;
const idValidator_1 = require("../utils/idValidator");
const groupInputDto_1 = require("../dtos/input/groupInputDto");
class GroupController {
    groupService;
    cloudinaryService;
    constructor(groupService, cloudinaryService) {
        this.groupService = groupService;
        this.cloudinaryService = cloudinaryService;
    }
    async getMyGroups(req, res, next) {
        try {
            const userId = req.user.userId;
            const groups = await this.groupService.getGroupsForUser(userId);
            return res.status(200).json({
                data: groups,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getGroupById(req, res, next) {
        try {
            const groupId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const userId = req.user.userId;
            const group = await this.groupService.getGroupById(groupId, userId);
            return res.status(200).json({
                data: group,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createGroup(req, res, next) {
        try {
            const userId = req.user.userId;
            const data = await groupInputDto_1.createGroupInputSchema.parseAsync({ ...req.body, filePicture: req.file });
            const group = await this.groupService.createGroup(data, userId);
            return res.status(201).json({
                data: group,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateGroup(req, res, next) {
        try {
            const groupId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const userId = req.user.userId;
            const data = await groupInputDto_1.updateGroupInputSchema.parseAsync({ ...req.body, groupId: groupId, filePicture: req.file });
            const updatedGroup = await this.groupService.updateGroup(data, userId);
            return res.status(200).json({
                data: updatedGroup,
                message: 'Grupo actualizado exitosamente',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteGroup(req, res, next) {
        try {
            const groupId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const userId = req.user.userId;
            await this.groupService.deleteGroup(groupId, userId);
            return res.status(200).json({
                message: 'Grupo eliminado exitosamente',
            });
        }
        catch (error) {
            next(error);
        }
    }
    async addMember(req, res, next) {
        try {
            const groupId = idValidator_1.mongoIdSchema.parse(req.params.groupId);
            const data = groupInputDto_1.addGroupMemberInputSchema.parse(req.body);
            const userId = req.user.userId;
            const group = await this.groupService.addMember({ groupId, email: data.email, role: data.role }, userId);
            return res.status(200).json({
                data: group,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateMemberRole(req, res, next) {
        try {
            const currentUserId = req.user.userId;
            const groupId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const userId = idValidator_1.mongoIdSchema.parse(req.params.userId);
            const role = req.body.role;
            const updatedGroup = await this.groupService.updateMemberRole({ groupId, userId, role }, currentUserId);
            return res.status(200).json({
                data: updatedGroup,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async removeMember(req, res, next) {
        try {
            const currentUserId = req.user.userId;
            const groupId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const userId = idValidator_1.mongoIdSchema.parse(req.params.userId);
            const updatedGroup = await this.groupService.removeMember({ groupId, userId }, currentUserId);
            return res.status(200).json({
                data: updatedGroup,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async uploadProfilePicture(req, res, next) {
        try {
            const groupId = idValidator_1.mongoIdSchema.parse(req.params.groupId);
            const userId = req.user.userId;
            if (!req.file)
                throw new Error('No se subió ninguna imagen');
            const data = await groupInputDto_1.updateGroupInputSchema.parseAsync({ groupId: groupId, filePicture: req.file });
            const updatedGroup = await this.groupService.updateGroup(data, userId);
            return res.status(200).json({
                data: updatedGroup,
                message: 'Foto de grupo actualizada exitosamente',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.GroupController = GroupController;
