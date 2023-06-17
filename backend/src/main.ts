import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    // allowedHeaders: ['Content-Type', 'Authorization'],
    // origin: '*',
    origin: '*',
    credentials: true,
    // preflightContinue: false,
  });
  app.setGlobalPrefix('api/v1', {});
  app.useGlobalPipes(new ValidationPipe());
  const PORT = process.env.PORT || 8888;
  await app.listen(PORT, () => {
    console.log('Server listen on port', PORT);
  });
}
bootstrap();
