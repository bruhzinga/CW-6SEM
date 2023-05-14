import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './App/app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './exceptions/http-exception.filter';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const srcPath = path.resolve(__dirname, '..', 'src');
  const httpsOptions = {
    key: fs.readFileSync(path.resolve(srcPath, './security/RS-LAB26-ZDA.key')),
    passphrase: 'SECRET',
    cert: fs.readFileSync(path.resolve(srcPath, './security/LAB.crt')),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('PrimeVideo API')
    .setDescription('The PrimeVideo API ')
    .setVersion('1.0')
    .addTag('Video')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter, {
      P2022: HttpStatus.BAD_REQUEST,
    }),
  );
  app.enableCors();
  await app.listen(3000);
}

bootstrap();
