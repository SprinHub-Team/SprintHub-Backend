import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';
import { projectDocumentController } from '../dependencies/projectDocumentDependency';

const router = Router();

router.use(requireAuth);

router.post('/:groupId', uploadMiddleware.single('file'), projectDocumentController.upload.bind(projectDocumentController));
router.get('/group/:groupId', projectDocumentController.getByGroup.bind(projectDocumentController));
router.delete('/:id', projectDocumentController.delete.bind(projectDocumentController));

export default router;
