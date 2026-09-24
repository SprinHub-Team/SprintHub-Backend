"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authInputDto_1 = require("../dtos/input/authInputDto");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async register(req, res) {
        try {
            const validation = authInputDto_1.registerInputSchema.safeParse(req.body);
            if (!validation.success) {
                res.status(400).json({ message: 'Errores de validación', errors: validation.error.format() });
                return;
            }
            await this.authService.register(validation.data);
            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message || 'Error en el servidor al registrar usuario' });
        }
    }
    async login(req, res) {
        try {
            const validation = authInputDto_1.loginInputSchema.safeParse(req.body);
            if (!validation.success) {
                res.status(400).json({ message: 'Credenciales inválidas', errors: validation.error.format() });
                return;
            }
            const result = await this.authService.login(validation.data);
            res.json({
                message: 'Sesión iniciada correctamente',
                token: result.token,
                user: result.user
            });
        }
        catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message || 'Error en el servidor al iniciar sesión' });
        }
    }
}
exports.AuthController = AuthController;
