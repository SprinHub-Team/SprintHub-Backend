import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { GroupService } from '../service/GroupService';
import { GroupRepository } from '../repository/GroupRepository';
import { UserRepository } from '../repository/UserRepository';
import { createGroupSchema, addMemberSchema } from '../dtos/GroupDto';
import AppError from '../errors/AppError';

const groupService = new GroupService(new GroupRepository(), new UserRepository());
const userRepo = new UserRepository();

export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    const validation = createGroupSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ message: 'Datos inválidos', errors: validation.error.format() });
      return;
    }

    const newGroup = await groupService.createGroup({ ...validation.data, ownerId: userId });
    res.status(201).json({ message: 'Grupo creado exitosamente', group: newGroup });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error al crear el grupo' });
  }
};

export const addMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const groupId = req.params.groupId as string;
    const reqUserId = req.user?.userId;
    if (!reqUserId) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    const validation = addMemberSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ message: 'Datos inválidos', errors: validation.error.format() });
      return;
    }

    // Verify requester is admin or collaborator
    const group = await groupService.getGroupById(groupId);
    const requester = group.members.find((m: any) => m.user._id?.toString() === reqUserId || m.user.toString() === reqUserId);
    if (!requester || (requester.role !== 'admin' && requester.role !== 'collaborator')) {
      throw new AppError('Solo los administradores o colaboradores pueden agregar miembros al grupo', 403);
    }

    const userToAdd = await userRepo.findByEmail(validation.data.email);
    if (!userToAdd) {
      throw new AppError('Usuario a agregar no encontrado', 404);
    }

    const updatedGroup = await groupService.addMember(groupId, userToAdd._id.toString(), validation.data.role);
    res.json({ message: 'Miembro agregado exitosamente', group: updatedGroup });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error al agregar miembro' });
  }
};

export const getMyGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    const groups = await groupService.getGroupsForUser(userId);
    res.json(groups);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error al obtener grupos' });
  }
};

export const deleteGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const groupId = req.params.groupId as string;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    // Verify requester is admin
    const group = await groupService.getGroupById(groupId);
    const requester = group.members.find((m: any) => m.user._id?.toString() === userId || m.user.toString() === userId);
    if (!requester || requester.role !== 'admin') {
      throw new AppError('Solo los administradores pueden eliminar el grupo', 403);
    }

    await groupService.deleteGroup(groupId);
    res.json({ message: 'Grupo eliminado exitosamente' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error al eliminar el grupo' });
  }
};
