import { Router } from 'express';
import { cardPBController } from '../dependencies/cardPBDependency';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/', (req, res) => cardPBController.create(req, res));
router.get('/group/:groupId', (req, res) => cardPBController.getBacklog(req, res));
router.delete('/:id', (req, res) => cardPBController.delete(req, res));
router.get('/group/:groupId/export-csv', (req, res) => cardPBController.exportCsv(req, res));

export default router;