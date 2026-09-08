"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authDependency_1 = require("../dependencies/authDependency");
const router = (0, express_1.Router)();
router.post('/login', (req, res) => authDependency_1.authController.login(req, res));
router.post('/register', (req, res) => authDependency_1.authController.register(req, res));
exports.default = router;
