"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
class UserMapper {
    static toResponse(user) {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            documentId: user.documentId,
            role: user.role,
            profilePicture: user.profilePicture || '',
            createdAt: user.createdAt.toISOString(),
        };
    }
}
exports.UserMapper = UserMapper;
