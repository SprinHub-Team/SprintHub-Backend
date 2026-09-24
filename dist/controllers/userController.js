"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userMapper_1 = require("../mappers/userMapper");
const idValidator_1 = require("../utils/idValidator");
class UserController {
    userService;
    cloudinaryService;
    constructor(userService, cloudinaryService) {
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
    }
    async getAllUsers(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            return res.status(200).json(users);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async getUserById(req, res) {
        try {
            const userId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const user = await this.userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async updateUser(req, res) {
        try {
            const userId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const updatedUser = await this.userService.updateUser(userId, req.body);
            return res.status(200).json(userMapper_1.UserMapper.toResponse(updatedUser));
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async deleteUser(req, res) {
        try {
            const userId = idValidator_1.mongoIdSchema.parse(req.params.id);
            const deletedUser = await this.userService.deleteUser(userId);
            return res.status(200).json({
                message: 'Usuario eliminado',
                data: deletedUser,
            });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    async uploadProfilePicture(req, res) {
        try {
            const userId = idValidator_1.mongoIdSchema.parse(req.params.id);
            if (!req.file) {
                return res.status(400).json({ message: 'No se subió ninguna imagen' });
            }
            const file = req.file;
            const user = await this.userService.getUserById(userId);
            if (user && user.profilePicture) {
                try {
                    const parts = user.profilePicture.split('/');
                    const publicId = parts.slice(-2).join('/').split('.')[0];
                    await this.cloudinaryService.delete(publicId);
                }
                catch (e) {
                    console.error('Error eliminando foto anterior', e);
                }
            }
            const fileResult = await this.cloudinaryService.upload({ buffer: file.buffer, fileName: file.originalname, mimeType: file.mimetype, path: 'UserPhotos' });
            const updatedUser = await this.userService.updateUser(userId, { profilePicture: fileResult.url });
            return res.status(200).json(userMapper_1.UserMapper.toResponse(updatedUser));
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.UserController = UserController;
