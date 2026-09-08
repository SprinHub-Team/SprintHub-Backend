"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(data) {
        const { name, email, password } = data;
        if (!name || !email || !password) {
            throw new Error('Nombre, email y contraseña son obligatorios');
        }
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('El correo electrónico ya está registrado');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
        const newUser = await this.userRepository.create({
            name,
            email,
            documentId: data.documentId || String(Date.now()),
            passwordHash: hashedPassword,
            password: hashedPassword,
        });
        return {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        };
    }
    async login(data) {
        const { email, password } = data;
        if (!email || !password) {
            throw new Error('Email y contraseña son obligatorios');
        }
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }
        const hash = user.passwordHash || user.password;
        if (!hash) {
            throw new Error('Credenciales inválidas');
        }
        const isValidPassword = await bcrypt_1.default.compare(password, hash);
        if (!isValidPassword) {
            throw new Error('Credenciales inválidas');
        }
        const env = require('../config/env').default;
        const secret = env.jwtsecret || 'secret';
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role || 'user' }, secret, { expiresIn: '1d' } // El token expira en 1 día
        );
        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    }
}
exports.AuthService = AuthService;
