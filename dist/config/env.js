"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../errors/AppError"));
const dotenv_1 = __importDefault(require("dotenv"));
const EnvDto_1 = require("../utils/EnvDto");
dotenv_1.default.config();
let env;
try {
    env = EnvDto_1.envSchema.parse({
        port: process.env.PORT,
        mongodburi: process.env.MONGODB_URI,
        jwtsecret: process.env.JWT_SECRET,
        corsOrigin: process.env.CORS_ORIGIN,
        serverUrl: process.env.SERVER_URL,
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_SECRET_KEY,
        cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    });
}
catch (error) {
    throw new AppError_1.default(`Variables de entorno inválidas${error.message}`, 500);
}
exports.default = env;
