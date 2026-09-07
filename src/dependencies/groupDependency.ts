import {GroupRepository} from '../repository/groupRepository';
import { GroupService } from '../service/groupService';
import { userRepository } from '../dependencies/userDependency';
import { GroupController } from '../controllers/groupController';

export const groupRepository = new GroupRepository();
export const groupService = new GroupService(groupRepository, userRepository);
export const groupController = new GroupController(groupService, userRepository);
// PARA IMPLEMENTAR IGUAL QUE LAS OTRAS CLASES SE DEBE MODIFICAR A CLASES EN VEZ DE METODOS INDEPENDIENTES
