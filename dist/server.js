"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./config/env"));
const database_1 = require("./config/database");
const http_1 = require("http");
const socket_1 = require("./sockets/socket");
async function startserver() {
    await (0, database_1.connectDatabase)();
    const httpServer = (0, http_1.createServer)(app_1.default);
    (0, socket_1.configureSockets)(httpServer);
    httpServer.listen(env_1.default.port, () => {
        console.log(`Servidor HTTP y WebSockets escuchando en el puerto ${env_1.default.port}`);
        console.log(`Ver estado del servidor: http://localhost:${env_1.default.port}/api/health`);
    });
}
startserver();
