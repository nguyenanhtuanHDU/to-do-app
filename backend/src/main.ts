import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 8888;
  await app.listen(PORT, () => {
    console.log('Server listen on port ', PORT);
  });
}
bootstrap();
