import { Router } from "express";
import { controllers } from "../dependencies/controllerDependency";
import { requireAuth } from '../middlewares/authMiddleware';


const sprintController = controllers.sprint;

const router = Router();
router.use(requireAuth);

router.post('/', sprintController.create.bind(sprintController));
router.get('/group/:groupId',sprintController.getByGroup.bind(sprintController));
router.put('/cards/:cardId/move', sprintController.moveCard.bind(sprintController));
router.get('/:sprintId/cards', sprintController.getSprintCards.bind(sprintController));
router.post('/cards/:cardId/export', sprintController.exportToBoard.bind(sprintController));

export default router;