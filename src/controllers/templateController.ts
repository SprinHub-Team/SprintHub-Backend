import { Request, Response } from 'express';
import { BOARD_TEMPLATES } from '../utils/templates';

export class TemplateController {
  async getAll(req: Request, res: Response) {
    try {
      res.status(200).json(BOARD_TEMPLATES);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching templates' });
    }
  }
}

export const templateController = new TemplateController();
