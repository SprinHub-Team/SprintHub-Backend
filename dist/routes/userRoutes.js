"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Asegúrate de importar la instancia desde userDependency, NO la clase desde controllers
const userDependency_1 = require("../dependencies/userDependency");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Usa funciones flecha (req, res) => ... para cada ruta
router.get('/', (req, res) => userDependency_1.userController.getAllUsers(req, res));
router.get('/me', authMiddleware_1.requireAuth, (req, res) => {
    if (req.user) {
        userDependency_1.userController.getUserById({ ...req, params: { id: req.user.userId } }, res);
    }
    else {
        res.status(401).json({ message: 'No autorizado' });
    }
});
router.get('/:id', (req, res) => userDependency_1.userController.getUserById(req, res));
router.put('/:id', authMiddleware_1.requireAuth, (req, res) => userDependency_1.userController.updateUser(req, res));
router.delete('/:id', authMiddleware_1.requireAuth, (req, res) => userDependency_1.userController.deleteUser(req, res));
router.post('/', (req, res) => userDependency_1.userController.createUser(req, res));
exports.default = router;
