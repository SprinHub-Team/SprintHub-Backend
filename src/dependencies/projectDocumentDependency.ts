import { ProjectDocumentRepository } from '../repository/projectDocumentRepository';
import { ProjectDocumentService } from '../service/projectDocumentService';
import { ProjectDocumentController } from '../controllers/projectDocumentController';
import { GroupRepository } from '../repository/groupRepository';

export const projectDocumentRepository = new ProjectDocumentRepository();
export const projectDocumentService = new ProjectDocumentService(projectDocumentRepository, new GroupRepository());
export const projectDocumentController = new ProjectDocumentController(projectDocumentService);
