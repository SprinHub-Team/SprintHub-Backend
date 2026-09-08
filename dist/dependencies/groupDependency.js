"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupController = exports.groupService = exports.groupRepository = void 0;
const groupRepository_1 = require("../repository/groupRepository");
const groupService_1 = require("../service/groupService");
const userRepository_1 = require("../repository/userRepository");
const groupController_1 = require("../controllers/groupController");
exports.groupRepository = new groupRepository_1.GroupRepository();
exports.groupService = new groupService_1.GroupService(exports.groupRepository, new userRepository_1.UserRepository());
exports.groupController = new groupController_1.GroupController(exports.groupService, new userRepository_1.UserRepository());
// PARA IMPLEMENTAR IGUAL QUE LAS OTRAS CLASES SE DEBE MODIFICAR A CLASES EN VEZ DE METODOS INDEPENDIENTES
