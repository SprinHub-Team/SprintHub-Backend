"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMapper = void 0;
class AuthMapper {
    static toAuthLoginResponse(user, token) {
        return {
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture || '',
            },
        };
    }
    static toAuthRegisterResponse(user) {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        };
    }
}
exports.AuthMapper = AuthMapper;
