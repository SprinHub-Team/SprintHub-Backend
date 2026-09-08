"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("./env"));
const dns_1 = __importDefault(require("dns"));
dns_1.default.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
async function connectDatabase() {
    await mongoose_1.default.connect(env_1.default.mongodburi);
    console.log('MongoDb conectado.');
}
