"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getAllUsers() {
        return await this.userRepository.findAll();
    }
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
        if (updateData.password) {
            const passwordHash = await bcrypt_1.default.hash(updateData.password, 10);
            updateData.passwordHash = passwordHash;
            updateData.password = passwordHash;
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
}
exports.UserService = UserService;
