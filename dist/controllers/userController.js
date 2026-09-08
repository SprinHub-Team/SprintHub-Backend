"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    // Crear un nuevo usuario
    async createUser(req, res) {
        try {
            // Nota: Asegúrate de que tu UserService tenga un método llamado createUser
            const newUser = await this.userService.createUser(req.body);
            return res.status(201).json(newUser);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    // Obtener todos los usuarios
    async getAllUsers(req, res) {
        try {
            // Nota: Asegúrate de que tu UserService tenga un método llamado getAllUsers
            const users = await this.userService.getAllUsers();
            return res.status(200).json(users);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    // Obtener un usuario por su ID
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            // Nota: Asegúrate de que tu UserService tenga un método llamado getUserById
            const user = await this.userService.getUserById(id);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    // Actualizar un usuario
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updatedUser = await this.userService.updateUser(id, req.body);
            return res.status(200).json(updatedUser);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    // Eliminar un usuario
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const deletedUser = await this.userService.deleteUser(id);
            return res.status(200).json({ message: 'Usuario eliminado', data: deletedUser });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.UserController = UserController;
