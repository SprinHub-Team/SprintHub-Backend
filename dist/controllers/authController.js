"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const UserDto_1 = require("../dtos/UserDto");
class AuthController {
    userService;
    authService;
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async register(req, res) {
        try {
            const validation = UserDto_1.createUserSchema.safeParse(req.body);
            if (!validation.success) {
                res.status(400).json({ message: 'Errores de validación', errors: validation.error.format() });
                return;
            }
            await this.userService.createUser(validation.data);
            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message || 'Error en el servidor al registrar usuario' });
        }
    }
    async login(req, res) {
        try {
            const validation = UserDto_1.loginSchema.safeParse(req.body);
            if (!validation.success) {
                res.status(400).json({ message: 'Credenciales inválidas', errors: validation.error.format() });
                return;
            }
            const result = await this.userService.loginUser(validation.data);
            res.json({
                message: 'Sesión iniciada correctamente',
                token: result.token,
                user: { id: result.user._id, name: result.user.name, email: result.user.email, role: result.user.role }
            });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message || 'Error en el servidor al iniciar sesión' });
        }
    }
}
exports.AuthController = AuthController;
