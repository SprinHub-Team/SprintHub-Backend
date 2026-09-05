"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyProfile = void 0;
const UserService_1 = require("../service/UserService");
const userService = new UserService_1.UserService();
const getMyProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        const user = await userService.getUserById(userId);
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            documentId: user.documentId,
            role: user.role
        });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Error al obtener perfil' });
    }
};
exports.getMyProfile = getMyProfile;
