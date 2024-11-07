import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors({ origin: '*' });
  // for creating the items master data
  app.use(bodyParser.json({ limit: '50mb' }));
  app.setGlobalPrefix('api/');
  await app.listen(3000);
}
bootstrap();
