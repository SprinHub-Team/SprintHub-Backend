"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.userRepository = void 0;
const userRepository_1 = require("../repository/userRepository");
const userService_1 = require("../service/userService");
const userController_1 = require("../controllers/userController");
exports.userRepository = new userRepository_1.UserRepository();
const userService = new userService_1.UserService(exports.userRepository);
exports.userController = new userController_1.UserController(userService);
