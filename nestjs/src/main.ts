import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerFactory } from './common/logger';
import { ValidationPipe } from '@nestjs/common';
import { urlencoded, json } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger/';
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });

const swaggerConfig = new DocumentBuilder()
  .setTitle('Your API Title')
  .setDescription('Your API description')
  .setVersion('1.0')
  .addServer(`http://localhost:${process.env.PORT || '5000'}/`, 'Local environment')
  .addTag('Your API Tag')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT Token',
      in: 'header',
    },
    'JWT-auth',
  )
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: LoggerFactory('MyApp') });
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      staticCSP: false,
    },
  });

  await app.listen(process.env.PORT || 5000, async () => {
    console.log('Server started on port: http://localhost:' + process.env.PORT);
  });
}

bootstrap();
