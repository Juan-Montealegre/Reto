"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
let cachedServer;
async function handler(req, res) {
    try {
        if (!cachedServer) {
            const app = await core_1.NestFactory.create(app_module_1.AppModule);
            app.enableCors();
            await app.init();
            cachedServer = app.getHttpAdapter().getInstance();
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