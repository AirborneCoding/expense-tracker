import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Removes properties not in the DTO
    forbidNonWhitelisted: true, // Rejects requests with extra fields
    transform: true, // Automatically transforms payloads to DTO instances
  }))
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
