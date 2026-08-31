import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { GroupService } from '../service/groupService';
import { GroupRepository } from '../repository/groupRepository';
import { createGroupSchema, addMemberSchema } from '../dtos/GroupDto';

const groupService = new GroupService(new GroupRepository());

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

    const newGroup = await groupService.createGroup(userId, validation.data);
    res.status(201).json({ message: 'Grupo creado exitosamente', group: newGroup });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error al crear el grupo' });
  }
};

export const addMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const groupId = req.params.groupId as string;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    const validation = addMemberSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ message: 'Datos inválidos', errors: validation.error.format() });
      return;
    }

    const group = await groupService.addMember(userId, groupId, validation.data);
    res.json({ message: 'Miembro agregado exitosamente', group });
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

    const groups = await groupService.getMyGroups(userId);
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

    await groupService.deleteGroup(userId, groupId);
    res.json({ message: 'Grupo eliminado exitosamente' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error al eliminar el grupo' });
  }
};
