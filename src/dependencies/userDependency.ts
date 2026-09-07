import { UserRepository } from "../repository/userRepository";
import {UserService} from "../service/userService";
import {UserController} from "../controllers/userController";

export const userRepository = new UserRepository();

export const userService = new UserService(userRepository);

export const userController = new UserController(userService);


// PARA IMPLEMENTAR IGUAL QUE LAS OTRAS CLASES SE DEBE MODIFICAR A CLASES EN VEZ DE METODOS INDEPENDIENTES