import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors({ origin: 'http://localhost:3000' });
  // for creating the items master data
  app.use(bodyParser.json({ limit: '50mb' }));
  app.setGlobalPrefix('api/');
  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
