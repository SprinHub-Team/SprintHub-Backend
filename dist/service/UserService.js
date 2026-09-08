"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(data) {
        if (!data.name || !data.email || !data.password) {
            throw new Error('Faltan campos obligatorios (nombre, email, contraseña)');
        }
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }
        const passwordHash = await bcrypt_1.default.hash(data.password, 10);
        return await this.userRepository.create({
            ...data,
            passwordHash,
            password: passwordHash
        });
    }
    async getAllUsers() {
        return await this.userRepository.findAll();
    }
    // Obtener un usuario por ID
    async getUserById(id) {
        if (!id) {
            throw new Error('El ID del usuario es obligatorio');
        }
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user;
    }
    async updateUser(id, updateData) {
        if (!id) {
            throw new Error('El ID del usuario es obligatorio');
        }
        const updatedUser = await this.userRepository.update(id, updateData);
        if (!updatedUser) {
            throw new Error('Usuario no encontrado para actualizar');
        }
        return updatedUser;
    }
    async deleteUser(id) {
        if (!id) {
            throw new Error('El ID del usuario es obligatorio');
        }
        const deletedUser = await this.userRepository.delete(id);
        if (!deletedUser) {
            throw new Error('Usuario no encontrado para eliminar');
        }
        return deletedUser;
    }
    async loginUser(data) {
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
            throw new Error('El usuario no tiene una contraseña registrada');
        }
        const isValidPassword = await bcrypt_1.default.compare(password, hash);
        if (!isValidPassword) {
            throw new Error('Credenciales inválidas');
        }
        const env = require('../config/env').default;
        const secret = env.jwtsecret || 'secret';
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role || 'user' }, secret, { expiresIn: '1d' });
        return {
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'user'
            },
            token,
        };
    }
}
exports.UserService = UserService;
