"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.envSchema = zod_1.default.object({
    port: zod_1.default.string().default('3000'),
    mongodburi: zod_1.default.string().min(1, { error: 'MONGODB_URI es requerida' }),
    jwtsecret: zod_1.default.string().min(1, { error: 'JWT_SECRET es requerido' }),
    corsOrigin: zod_1.default.string().min(1, { error: 'CORS_ORIGIN es requerido' }),
    serverUrl: zod_1.default.string().min(1, { error: 'SERVER_URL es requerida' }),
    supabaseUrl: zod_1.default.string().min(1, { error: 'SUPABASE_URL es requerida' }),
    supabaseKey: zod_1.default.string().min(1, { error: 'SUPABASE_SECRET_KEY es requerida' }),
    cloudinaryName: zod_1.default.string().min(1, { error: 'CLOUDINARY_CLOUD_NAME es requerida' }),
    cloudinaryApiKey: zod_1.default.string().min(1, { error: 'CLOUDINARY_API_KEY es requerida' }),
    cloudinaryApiSecret: zod_1.default.string().min(1, { error: 'CLOUDINARY_API_SECRET es requerida' }),
});
