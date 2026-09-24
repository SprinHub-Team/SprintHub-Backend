"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuthMiddleware = socketAuthMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const ValidationError_1 = __importDefault(require("../errors/ValidationError"));
function socketAuthMiddleware(socket, next) {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new ValidationError_1.default('No se proporciono token de autentificacion'));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.jwtsecret);
        socket.data.userId = decoded.userId;
        socket.data.role = decoded.role;
        next();
    }
    catch (err) {
        next(new ValidationError_1.default('Token inavlido para sesion de Sockets'));
    }
}
