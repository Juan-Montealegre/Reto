"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
let cachedServer;
async function handler(req, res) {
    try {
        if (!cachedServer) {
            const expressApp = (0, express_1.default)();
            const adapter = new platform_express_1.ExpressAdapter(expressApp);
            const app = await core_1.NestFactory.create(app_module_1.AppModule, adapter);
            app.enableCors();
            await app.init();
            cachedServer = expressApp;
        }
        return cachedServer(req, res);
    }
    catch (error) {
        console.error('Vercel Handler Error:', error);
        return res.status(500).json({
            statusCode: 500,
            message: error?.message || 'Internal Server Error in Vercel Handler',
            error: String(error),
        });
    }
}
//# sourceMappingURL=vercel-handler.js.map