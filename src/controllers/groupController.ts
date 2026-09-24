import { Request, Response, NextFunction } from 'express';
import { GroupService } from '../service/groupService';
import { mongoIdSchema } from '../utils/idValidator';
import CloudinaryStorageService from '../service/storage/cloudinaryStorageService';
import { addGroupMemberInputSchema, createGroupInputSchema, updateGroupInputSchema } from '../dtos/input/groupInputDto';

export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly cloudinaryService: CloudinaryStorageService
  ) {}

    async getMyGroups(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {

      const userId = req.user.userId;

      const groups = await this.groupService.getGroupsForUser(userId);

      return res.status(200).json({
        data: groups,
      });
    } catch (error) {
      next(error);
    }
  }

  async getGroupById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const groupId = mongoIdSchema.parse(req.params.id);

      const userId = req.user.userId;

      const group = await this.groupService.getGroupById(groupId, userId);

      return res.status(200).json({
        data: group,
      });
    } catch (error) {
      next(error);
    }
  }

  async createGroup(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {

      const userId = req.user.userId;

      const file = {
        fileName: req.file?.originalname,
        buffer: req.file?.buffer
      }

      const data = await createGroupInputSchema.parseAsync({...req.body,filePicture: file} );

      const group = await this.groupService.createGroup(
        data,
        userId
      );

      return res.status(201).json({
        data: group,
      });

    } catch (error) {
      next(error);
    }
  }
  
  async updateGroup(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const groupId = mongoIdSchema.parse(req.params.id);
      const userId = req.user.userId;
      const file = {
        fileName: req.file?.originalname,
        buffer: req.file?.buffer
      }

      const data = await updateGroupInputSchema.parseAsync({...req.body, groupId, filePicture: file});
      const updatedGroup = await this.groupService.updateGroup(data, userId);

      return res.status(200).json({
        data: updatedGroup,
        message: 'Grupo actualizado exitosamente',
      });

    } catch (error) {
      next(error);
    }
  }

  async deleteGroup(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {

      const groupId = mongoIdSchema.parse(req.params.id);
      const userId = req.user.userId;

      await this.groupService.deleteGroup(groupId, userId);

      return res.status(200).json({
        message: 'Grupo eliminado exitosamente',
      });

    } catch (error) {
      next(error);
    }
  }

  async addMember(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {

      const groupId = mongoIdSchema.parse(req.params.groupId);
      const data = addGroupMemberInputSchema.parse(req.body);
      const userId = req.user.userId;

      const group = await this.groupService.addMember({groupId, email: data.email, role: data.role}, userId);

      return res.status(200).json({
        data: group,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMemberRole(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {

      const currentUserId = req.user.userId;

      const groupId = mongoIdSchema.parse(req.params.id);
      const userId = mongoIdSchema.parse(req.params.userId);
      const role = req.body.role;

      const updatedGroup = await this.groupService.updateMemberRole({groupId, userId, role}, currentUserId);

      return res.status(200).json({
        data: updatedGroup,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeMember(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {

      const currentUserId = req.user.userId;

      const groupId = mongoIdSchema.parse(req.params.id);
      const userId = mongoIdSchema.parse(req.params.userId);

      const updatedGroup = await this.groupService.removeMember({groupId,userId}, currentUserId);

      return res.status(200).json({
        data: updatedGroup,
      });
    } catch (error) {
      next(error);
    }
  }

}
