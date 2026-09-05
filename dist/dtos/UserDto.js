"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.updateUserSchema = exports.createUserSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    name: zod_1.z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    email: zod_1.z.string().email('Debe ser un correo válido'),
    documentId: zod_1.z.string().min(5, 'El documento debe tener al menos 5 caracteres'),
    password: zod_1.z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
    role: zod_1.z.enum(['admin', 'user']).default('user'),
});
exports.createUserSchema = exports.userSchema.required({ password: true }).omit({ _id: true, role: true });
exports.updateUserSchema = exports.userSchema.omit({ _id: true, password: true }).partial();
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1)
});
