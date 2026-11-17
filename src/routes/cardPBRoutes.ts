import { Router } from 'express';
import { controllers } from '../dependencies/controllerDependency';
import { requireAuth } from '../middlewares/authMiddleware';

const cardPBController = controllers.cardPb;
const router = Router();

router.use(requireAuth);
router.get('/group/:groupId/planning', cardPBController.getPlanning.bind(cardPBController));
router.post('/reorder', cardPBController.reorder.bind(cardPBController));
router.patch('/:id', cardPBController.update.bind(cardPBController));
router.post('/', cardPBController.create.bind(cardPBController));
router.get('/group/:groupId',cardPBController.getBacklog.bind(cardPBController));
router.delete('/:id', cardPBController.delete.bind(cardPBController));
router.get('/group/:groupId/export-csv', cardPBController.exportCsv.bind(cardPBController));

export default router;