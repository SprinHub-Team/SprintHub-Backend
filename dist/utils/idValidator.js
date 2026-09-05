"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoIdSchema = void 0;
const zod_1 = require("zod");
exports.mongoIdSchema = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "El ID proporcionado no tiene un formato válido.");
