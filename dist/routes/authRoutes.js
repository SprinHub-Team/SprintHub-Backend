"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllerDependency_1 = require("../dependencies/controllerDependency");
const authController = controllerDependency_1.controllers.auth;
const router = (0, express_1.Router)();
router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));
exports.default = router;
