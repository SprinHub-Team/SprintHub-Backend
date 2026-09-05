"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../config/env"));
const requireAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.default.jwtsecret || 'secret');
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};
exports.requireAuth = requireAuth;
const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
        return;
    }
    next();
};
exports.requireAdmin = requireAdmin;
