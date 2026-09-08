import {GroupRepository} from '../repository/groupRepository';
import { GroupService } from '../service/groupService';
import { UserRepository } from '../repository/userRepository';
import { GroupController } from '../controllers/groupController';

export const groupRepository = new GroupRepository();
export const groupService = new GroupService(groupRepository, new UserRepository());
export const groupController = new GroupController(groupService, new UserRepository());
// PARA IMPLEMENTAR IGUAL QUE LAS OTRAS CLASES SE DEBE MODIFICAR A CLASES EN VEZ DE METODOS INDEPENDIENTES
