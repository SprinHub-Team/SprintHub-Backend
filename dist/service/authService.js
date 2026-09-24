"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const authMapper_1 = require("../mappers/authMapper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = __importDefault(require("../config/env"));
class AuthService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async register(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('El correo electrónico ya está registrado');
        }
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        const newUser = await this.userRepository.create({
            name: data.name,
            email: data.email,
            documentId: data.documentId,
            passwordHash,
        });
        return authMapper_1.AuthMapper.toAuthRegisterResponse(newUser);
    }
    async login(data) {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }
        const isValidPassword = await bcrypt_1.default.compare(data.password, user.passwordHash);
        if (!isValidPassword) {
            throw new Error('Credenciales inválidas');
        }
        const payload = {
            userId: user._id.toString(),
            role: user.role,
        };
        const token = jsonwebtoken_1.default.sign(payload, env_1.default.jwtsecret, {
            expiresIn: '1d',
        });
        return authMapper_1.AuthMapper.toAuthLoginResponse(user, token);
    }
}
exports.AuthService = AuthService;
