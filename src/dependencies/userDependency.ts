import { UserRepository } from '../repository/userRepository';
import { UserService } from '../service/userService';
import { UserController } from '../controllers/userController';


export const userRepository = new UserRepository();


const userService = new UserService(userRepository);


export const userController = new UserController(userService);