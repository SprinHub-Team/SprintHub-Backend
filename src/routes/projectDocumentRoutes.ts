import { Router } from 'express';
import { requireAuth } from '../middlewares/authMiddleware';
import { controllers } from '../dependencies/controllerDependency';
import { uploadToSupabase } from '../middlewares/uploadMiddleware';

const projectDocumentController = controllers.projectDd;

const router = Router();

router.use(requireAuth);

router.post('/:groupId', uploadToSupabase.single('file'), projectDocumentController.upload.bind(projectDocumentController));
router.get('/group/:groupId', projectDocumentController.getByGroup.bind(projectDocumentController));
router.delete('/:id', projectDocumentController.delete.bind(projectDocumentController));

export default router;
