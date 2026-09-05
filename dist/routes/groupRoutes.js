"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groupController_1 = require("../controllers/groupController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Todas las rutas de grupos requieren autenticación
router.use(authMiddleware_1.requireAuth);
router.post('/', groupController_1.createGroup);
router.get('/', groupController_1.getMyGroups);
router.post('/:groupId/members', groupController_1.addMember);
router.delete('/:groupId', groupController_1.deleteGroup);
exports.default = router;
