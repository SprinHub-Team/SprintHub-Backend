import { Response } from 'express';
import { GroupModel } from '../models/Group';
import { UserModel } from '../models/User';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.userId;

    if (!name) {
      res.status(400).json({ message: 'El nombre del grupo es obligatorio' });
      return;
    }

    const newGroup = new GroupModel({
      name,
      description,
      ownerId: userId,
      members: [{ user: userId, role: 'admin' }], // El creador es admin por defecto
    });

    await newGroup.save();
    res.status(201).json({ message: 'Grupo creado exitosamente', group: newGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el grupo' });
  }
};

export const addMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { groupId } = req.params;
    const { email, role } = req.body; // Agregar por email y especificar rol
    const userId = req.user?.userId;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Grupo no encontrado' });
      return;
    }

    // Verificar que el solicitante sea 'admin' del grupo
    const requesterMember = group.members.find(m => m.user.toString() === userId);
    if (!requesterMember || requesterMember.role !== 'admin') {
      res.status(403).json({ message: 'Solo los administradores pueden agregar miembros al grupo' });
      return;
    }

    const userToAdd = await UserModel.findOne({ email });
    if (!userToAdd) {
      res.status(404).json({ message: 'Usuario a agregar no encontrado' });
      return;
    }

    const isAlreadyMember = group.members.some(m => m.user.toString() === userToAdd._id.toString());
    if (isAlreadyMember) {
      res.status(400).json({ message: 'El usuario ya pertenece al grupo' });
      return;
    }

    const newRole = ['admin', 'collaborator', 'visitor'].includes(role) ? role : 'collaborator';

    group.members.push({ user: userToAdd._id as any, role: newRole });
    await group.save();

    res.json({ message: 'Miembro agregado exitosamente', group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar miembro' });
  }
};

export const getMyGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    // Buscar grupos donde el usuario está en el array de members
    const groups = await GroupModel.find({ 'members.user': userId })
      .populate('ownerId', 'name email')
      .populate('members.user', 'name email');
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener grupos' });
  }
};

export const deleteGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.userId;

    const group = await GroupModel.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Grupo no encontrado' });
      return;
    }

    const requesterMember = group.members.find(m => m.user.toString() === userId);
    if (!requesterMember || requesterMember.role !== 'admin') {
      res.status(403).json({ message: 'Solo los administradores pueden eliminar el grupo.' });
      return;
    }

    await GroupModel.findByIdAndDelete(groupId);
    res.json({ message: 'Grupo eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el grupo' });
  }
};
