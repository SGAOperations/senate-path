import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';

// Import the compiled AppModule
const { AppModule } = require('../dist/apps/backend/main.js');

export default async (req: Request, res: Response) => {
  const expressApp = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      logger: false, // Disable logging for serverless
      abortOnError: false,
    }
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

  // Handle the request
  expressApp(req, res);
};
