import { Request, Response, NextFunction } from 'express';
import { GroupService } from '../service/groupService';
import { mongoIdSchema } from '../utils/idValidator';
import CloudinaryStorageService from '../service/storage/cloudinaryStorageService';
import { addGroupMemberInputSchema, createGroupInputSchema } from '../dtos/input/groupInputDto';

export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly cloudinaryService: CloudinaryStorageService
  ) {}

  async createGroup(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.userId;

      const data = createGroupInputSchema.parse(req.body);

      const group = await this.groupService.createGroup({
        ...data,
        ownerId: userId,
      });

      return res.status(201).json({
        data: group,
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

      const group = await this.groupService.addMember(
        groupId,
        data.email,
        data.role,
      );

      return res.status(200).json({
        data: group,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyGroups(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: 'No autorizado',
        });
      }

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

      const group = await this.groupService.getGroupById(groupId);

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
      const groupId = mongoIdSchema.parse(req.params.id);
      const userId = mongoIdSchema.parse(req.params.userId);

      const updatedGroup = await this.groupService.updateMemberRole(
        groupId,
        userId,
        req.body.role,
      );

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
      const groupId = mongoIdSchema.parse(req.params.id);
      const userId = mongoIdSchema.parse(req.params.userId);

      const updatedGroup = await this.groupService.removeMember(
        groupId,
        userId,
      );

      return res.status(200).json({
        data: updatedGroup,
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
      const data = req.body;
      const updatedGroup = await this.groupService.updateGroup(groupId, data);

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

      await this.groupService.deleteGroup(groupId);

      return res.status(200).json({
        message: 'Grupo eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadProfilePicture(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const groupId = mongoIdSchema.parse(req.params.id);
      if (!req.file) {
        return res.status(400).json({ message: 'No se subió ninguna imagen' });
      }

      const file = req.file;

      const fileResult = await this.cloudinaryService.upload({buffer: file.buffer,fileName: file.filename, mimeType: file.mimetype, path: 'GroupPhotos' });

      const updatedGroup = await this.groupService.updateGroup(groupId, { profilePicture: fileResult.url });

      return res.status(200).json({
        data: updatedGroup,
        message: 'Imagen de grupo actualizada',
      });
    } catch (error) {
      next(error);
    }
  }
}
