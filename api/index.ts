import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';

// We'll import the compiled AppModule
const { AppModule } = require('../dist/apps/backend/main.js');

let app: INestApplication;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'],
    });
    
    app.enableCors();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      })
    );
    
    await app.init();
  }
  return app.getHttpAdapter().getInstance();
}

export default async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};