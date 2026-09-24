"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginInputSchema = exports.registerInputSchema = void 0;
const zod_1 = require("zod");
exports.registerInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { error: 'El nombre debe tener al menos 2 caracteres' }).max(100),
    email: zod_1.z.email({ error: 'Debe ser un correo electrónico válido' }),
    documentId: zod_1.z.string().min(5, { error: 'El documento debe tener al menos 5 caracteres' }),
    password: zod_1.z.string().min(6, { error: 'La contraseña debe tener al menos 6 caracteres' }),
});
exports.loginInputSchema = zod_1.z.object({
    email: zod_1.z.email({ error: 'Formato de correo inválido' }),
    password: zod_1.z.string().min(1, { error: 'La contraseña es obligatoria' }),
});
