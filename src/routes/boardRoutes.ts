import { Router } from 'express';
import { boardController} from '../dependencies/boardDependency';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/group/:groupId', boardController.findByGroupId.bind(boardController) );
router.get('/:id', boardController.getBoardWhitDetails.bind(boardController) );
router.post('/', boardController.create.bind(boardController));
router.put('/:id', boardController.update.bind(boardController));
router.delete('/:id', boardController.delete.bind(boardController));

export default router;
