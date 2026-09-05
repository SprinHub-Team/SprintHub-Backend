"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
// Ejemplo de ruta protegida para obtener el perfil (opcional, pero útil)
router.get('/me', authMiddleware_1.requireAuth, (req, res) => {
    res.json({ message: 'Ruta protegida', user: req.user });
});
exports.default = router;
