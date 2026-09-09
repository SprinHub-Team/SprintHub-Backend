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
router.post('/:groupId/members', (req, res) => groupDependency_1.groupController.addMember(req, res));
router.put('/:id/members/:userId', (req, res) => groupDependency_1.groupController.updateMemberRole(req, res));
router.delete('/:id/members/:userId', (req, res) => groupDependency_1.groupController.removeMember(req, res));
router.delete('/:groupId', (req, res) => groupDependency_1.groupController.deleteGroup(req, res));
exports.default = router;
