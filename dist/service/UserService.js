"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserRepository_1 = require("../repository/UserRepository");
const AppError_1 = __importDefault(require("../errors/AppError"));
class UserService {
    userRepo;
    constructor(userRepo = new UserRepository_1.UserRepository()) {
        this.userRepo = userRepo;
    }
    async createUser(data) {
        const emailTaken = await this.userRepo.findByEmail(data.email);
        if (emailTaken)
            throw new AppError_1.default('El email ya está registrado', 409);
        const docTaken = await this.userRepo.findByDocumentId(data.documentId);
        if (docTaken)
            throw new AppError_1.default('El documento ya está registrado', 409);
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        return this.userRepo.create({ ...data, passwordHash });
    }
    async loginUser(data) {
        const user = await this.userRepo.findByEmail(data.email);
        if (!user)
            throw new AppError_1.default('Credenciales incorrectas', 401);
        const isMatch = await bcrypt_1.default.compare(data.password, user.passwordHash);
        if (!isMatch)
            throw new AppError_1.default('Credenciales incorrectas', 401);
        const jwt = require('jsonwebtoken');
        const env = require('../config/env').default;
        const token = jwt.sign({ userId: user._id, role: user.role }, env.jwtsecret || 'secret', { expiresIn: '8h' });
        return { token, user };
    }
    async getUserById(id) {
        const user = await this.userRepo.findById(id);
        if (!user)
            throw new AppError_1.default('Usuario no encontrado', 404);
        return user;
    }
    async updateUser(id, data) {
        const exists = await this.userRepo.existById(id);
        if (!exists)
            throw new AppError_1.default('Usuario no encontrado', 404);
        return this.userRepo.update(id, data);
    }
    async deleteUser(id) {
        const exists = await this.userRepo.existById(id);
        if (!exists)
            throw new AppError_1.default('Usuario no encontrado', 404);
        return this.userRepo.delete(id);
    }
}
exports.UserService = UserService;
