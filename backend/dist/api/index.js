"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = vercelHandler;
const express_1 = __importDefault(require("express"));
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const app_module_1 = require("../src/app.module");
const server = (0, express_1.default)();
let handler = null;
async function bootstrap() {
    if (handler) {
        return handler;
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    const allowedOrigin = process.env.FRONTEND_URL || '*';
    app.enableCors({
        origin: allowedOrigin,
        methods: ['GET'],
    });
    await app.init();
    handler = server;
    return handler;
}
async function vercelHandler(req, res) {
    const appHandler = await bootstrap();
    return appHandler(req, res, () => {
        if (!res.writableEnded) {
            res.status(404).json({ message: 'Not Found' });
        }
    });
}
//# sourceMappingURL=index.js.map