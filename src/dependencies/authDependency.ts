import { UserRepository } from '../repository/userRepository';
import { UserService } from '../service/userService';
import { AuthService } from '../service/authService';
import { AuthController } from '../controllers/authController';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const authService = new AuthService(userRepository);

export const authController = new AuthController(userService, authService);