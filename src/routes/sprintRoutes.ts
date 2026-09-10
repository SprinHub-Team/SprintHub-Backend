import { Router } from "express";
import { sprintController } from "../dependencies/sprintDependency";
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/', (req,res) => sprintController.create(req,res));
router.get('/group/:groupId', (req,res) => sprintController.getByGroup(req,res));
router.put('/cards/:cardId/move', (req,res) => sprintController.moveCard(req,res));
router.get('/:sprintId/cards', (req,res) => sprintController.getSprintCards(req,res));
router.post('/cards/:cardId/export', (req,res) => sprintController.exportToBoard(req,res));

export default router;