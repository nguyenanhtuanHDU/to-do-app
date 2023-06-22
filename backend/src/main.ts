import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import cookieParser from 'cookie-parser';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // allowedHeaders: '*',
    origin: 'http://localhost:4200',
    // origin: '*',
    credentials: true,
    exposedHeaders: ['Content-Type'],
  });
  app.use(cookieParser());
  app.setGlobalPrefix('v1/api', {});
  app.useGlobalPipes(new ValidationPipe());
  const PORT = process.env.PORT || 8888;
  await app.listen(PORT, () => {
    console.log('Server listen on port', PORT);
  });
}
bootstrap();
