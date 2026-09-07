import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { GroupService } from '../service/groupService';
import { UserRepository } from '../repository/userRepository';
import { createGroupSchema, addMemberSchema } from '../dtos/GroupDto';
import AppError from '../errors/AppError';





 export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly userRepository: UserRepository
  ) {}
    
  
 async createGroup (req: AuthRequest, res: Response): Promise<void> {
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

    const newGroup = await this.groupService.createGroup({ ...validation.data, ownerId: userId });
    res.status(201).json({ message: 'Grupo creado exitosamente', group: newGroup });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error al crear el grupo' });
  }
}

async addMember (req: AuthRequest, res: Response): Promise<void> {
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
    const group = await this.groupService.getGroupById(groupId);
    const requester = group.members.find((m: any) => m.user._id?.toString() === reqUserId || m.user.toString() === reqUserId);
    if (!requester || (requester.role !== 'admin' && requester.role !== 'collaborator')) {
      throw new AppError('Solo los administradores o colaboradores pueden agregar miembros al grupo', 403);
    }

    const userToAdd = await this.userRepository.findByEmail(validation.data.email);
    if (!userToAdd) {
      throw new AppError('Usuario a agregar no encontrado', 404);
    }

    const updatedGroup = await this.groupService.addMember(groupId, userToAdd._id.toString(), validation.data.role);
    res.json({ message: 'Miembro agregado exitosamente', group: updatedGroup });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error al agregar miembro' });
  }
}

async getMyGroups(req: AuthRequest, res: Response): Promise<void>  {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    const groups = await this.groupService.getGroupsForUser(userId);
    res.json(groups);
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error al obtener grupos' });
  }
}

async deleteGroup (req: AuthRequest, res: Response): Promise<void> {
  try {
    const groupId = req.params.groupId as string;
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'No autorizado' });
      return;
    }

    // Verify requester is admin
    const group = await this.groupService.getGroupById(groupId);
    const requester = group.members.find((m: any) => m.user._id?.toString() === userId || m.user.toString() === userId);
    if (!requester || requester.role !== 'admin') {
      throw new AppError('Solo los administradores pueden eliminar el grupo', 403);
    }

    await this.groupService.deleteGroup(groupId);
    res.json({ message: 'Grupo eliminado exitosamente' });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Error al eliminar el grupo' });
  }
}
}
