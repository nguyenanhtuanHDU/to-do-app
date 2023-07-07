import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import cookieParser from 'cookie-parser';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // allowedHeaders: '*',
    origin: process.env.FRONTEND_URL,
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
  // const connectDB = await mongoose.connection.readyState;
  // if (connectDB === 0) {
  //   console.log('Mongoose disconnected');
  // } else if (connectDB === 1) {
  //   console.log('Mongoose connected');
  // } else if (connectDB === 2) {
  //   console.log('Mongoose connecting');
  // } else if (connectDB === 3) {
  //   console.log('Mongoose disconnecting');
  // }
}
bootstrap();
