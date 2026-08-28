import { Response } from 'express';
import {CardModel} from '../models/Card';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createCard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, columnId, boardId, position, dueDate, assignedTo } = req.body;

    if (!title || !columnId || !boardId) {
      res.status(400).json({ message: 'Título, columnId y boardId son obligatorios' });
      return;
    }

    const newCard = new CardModel({
      title,
      description,
      columnId,
      boardId,
      position: position || 0,
      dueDate,
      assignedTo: assignedTo || [],
    });

    await newCard.save();
    res.status(201).json({ message: 'Tarjeta creada exitosamente', card: newCard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la tarjeta' });
  }
};

export const getCards = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { boardId } = req.params;
    const { title, columnId, assignedTo } = req.query;

    let filter: any = { boardId };

    if (title) {
      filter.title = { $regex: title, $options: 'i' }; // Búsqueda insensible a mayúsculas
    }
    if (columnId) {
      filter.columnId = columnId;
    }
    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    const cards = await CardModel.find(filter).populate('assignedTo', 'name email');
    res.json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las tarjetas' });
  }
};

export const updateCard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params;
    const updates = req.body;

    const updatedCard = await CardModel.findByIdAndUpdate(cardId, updates, { new: true });
    if (!updatedCard) {
      res.status(404).json({ message: 'Tarjeta no encontrada' });
      return;
    }

    res.json({ message: 'Tarjeta actualizada', card: updatedCard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la tarjeta' });
  }
};

export const deleteCard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params;

    const deletedCard = await CardModel.findByIdAndDelete(cardId);
    if (!deletedCard) {
      res.status(404).json({ message: 'Tarjeta no encontrada' });
      return;
    }

    res.json({ message: 'Tarjeta eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la tarjeta' });
  }
};
