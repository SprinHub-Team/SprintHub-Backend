"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToSupabase = exports.uploadToCloudinary = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const storage = multer_1.default.memoryStorage();
const CLOUDINARY_ALLOWED = {
    '.png': ['image/png'],
    '.jpg': ['image/jpeg', 'image/pjpeg'],
    '.jpeg': ['image/jpeg', 'image/pjpeg'],
    '.webp': ['image/webp'],
    '.mp3': ['audio/mpeg', 'audio/mp3'],
    '.wav': ['audio/wav', 'audio/x-wav'],
    '.ogg': ['audio/ogg', 'video/ogg'],
    '.m4a': ['audio/x-m4a', 'audio/m4a']
};
const cloudinaryFilter = (req, file, cb) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;
    if (!CLOUDINARY_ALLOWED[ext]) {
        return cb(new AppError_1.default('Formato no válido. Para Cloudinary solo se permiten imágenes (PNG, JPG, JPEG, WEBP) y audios (MP3, WAV, OGG, M4A).', 400));
    }
    if (!CLOUDINARY_ALLOWED[ext].includes(mimeType)) {
        return cb(new AppError_1.default('Alerta de seguridad: El contenido del archivo multimedia no coincide con su extensión.', 400));
    }
    cb(null, true);
};
exports.uploadToCloudinary = (0, multer_1.default)({
    storage,
    fileFilter: cloudinaryFilter,
    limits: {
        fileSize: 15 * 1024 * 1024,
        files: 1
    }
});
const SUPABASE_ALLOWED = {
    '.pdf': ['application/pdf'],
    '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    '.xls': ['application/vnd.ms-excel']
};
const supabaseFilter = (req, file, cb) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;
    if (!SUPABASE_ALLOWED[ext]) {
        return cb(new AppError_1.default('Formato no válido. Para Supabase solo se permiten PDFs y archivos de Excel (XLSX, XLS).', 400));
    }
    if (!SUPABASE_ALLOWED[ext].includes(mimeType)) {
        return cb(new AppError_1.default('Alerta de seguridad: El contenido del documento no coincide con su extensión.', 400));
    }
    cb(null, true);
};
exports.uploadToSupabase = (0, multer_1.default)({
    storage,
    fileFilter: supabaseFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    }
});
