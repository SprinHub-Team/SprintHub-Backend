"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const env_1 = __importDefault(require("./env"));
cloudinary_1.v2.config({
    cloud_name: env_1.default.cloudinaryName,
    api_key: env_1.default.cloudinaryApiKey,
    api_secret: env_1.default.cloudinaryApiSecret
});
exports.default = cloudinary_1.v2;
