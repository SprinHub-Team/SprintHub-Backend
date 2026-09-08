"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// ¡IMPORTANTE! Importar desde dependencias
const groupDependency_1 = require("../dependencies/groupDependency");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.requireAuth);
router.post('/', (req, res) => groupDependency_1.groupController.createGroup(req, res));
router.get('/', (req, res) => groupDependency_1.groupController.getMyGroups(req, res));
router.get('/:id', (req, res) => groupDependency_1.groupController.getGroupById(req, res));
exports.default = router;
