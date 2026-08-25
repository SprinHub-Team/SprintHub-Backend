import { Response } from 'express';
import Group from '../models/Group';
import User from '../models/User';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.userId;

    if (!name) {
      res.status(400).json({ message: 'El nombre del grupo es obligatorio' });
      return;
    }

    const newGroup = new Group({
      name,
      description,
      ownerId: userId,
      members: [userId], // El creador es miembro por defecto
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
    const { email } = req.body; // Agregar por email
    const userId = req.user?.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Grupo no encontrado' });
      return;
    }

    if (group.ownerId.toString() !== userId) {
      res.status(403).json({ message: 'Solo el propietario puede agregar miembros' });
      return;
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      res.status(404).json({ message: 'Usuario a agregar no encontrado' });
      return;
    }

    if (group.members.includes(userToAdd._id as any)) {
      res.status(400).json({ message: 'El usuario ya pertenece al grupo' });
      return;
    }

    group.members.push(userToAdd._id as any);
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
    const groups = await Group.find({ members: userId }).populate('ownerId', 'name email').populate('members', 'name email');
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener grupos' });
  }
};
