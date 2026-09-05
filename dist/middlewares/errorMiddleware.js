"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../errors/AppError"));
const errorMiddleware = (error, req, res, next) => {
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({
            message: "Datos invalidos",
            errors: error.issues
        });
        return;
    }
    if (error instanceof AppError_1.default) {
        res.status(error.statusCode).json({
            message: error.message
        });
        return;
    }
    console.error(error);
    res.status(500).json({
        message: "Error insterno del servidor"
    });
};
exports.errorMiddleware = errorMiddleware;
