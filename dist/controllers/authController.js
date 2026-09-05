"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const UserDto_1 = require("../dtos/UserDto");
const UserService_1 = require("../service/UserService");
const userService = new UserService_1.UserService();
const register = async (req, res) => {
    try {
        const validation = UserDto_1.createUserSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ message: 'Errores de validación', errors: validation.error.format() });
            return;
        }
        await userService.createUser(validation.data);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Error en el servidor al registrar usuario' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const validation = UserDto_1.loginSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ message: 'Credenciales inválidas', errors: validation.error.format() });
            return;
        }
        const result = await userService.loginUser(validation.data);
        res.json({
            message: 'Sesión iniciada correctamente',
            token: result.token,
            user: { id: result.user._id, name: result.user.name, email: result.user.email, role: result.user.role }
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Error en el servidor al iniciar sesión' });
    }
};
exports.login = login;
