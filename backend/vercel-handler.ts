import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedServer: any;

export default async function handler(req: any, res: any) {
  try {
    if (!cachedServer) {
      const expressApp = express();
      const adapter = new ExpressAdapter(expressApp);
      const app = await NestFactory.create(AppModule, adapter);
      app.enableCors();
      await app.init();
      cachedServer = expressApp;
    }
    return cachedServer(req, res);
  } catch (error: any) {
    console.error('Vercel Handler Error:', error);
    return res.status(500).json({
      statusCode: 500,
      message: error?.message || 'Internal Server Error in Vercel Handler',
      error: String(error),
    });
  }
}
