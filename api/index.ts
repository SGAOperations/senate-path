import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// Import the compiled AppModule
const { AppModule } = require('../dist/apps/backend/main.js');

const expressApp = express();
let isAppInitialized = false;

async function bootstrap() {
  if (!isAppInitialized) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { logger: ['error', 'warn'] }
    );

    app.enableCors();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      })
    );

    await app.init();
    isAppInitialized = true;
  }

  return expressApp;
}

export default async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};
