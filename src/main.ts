import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './App/app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './Exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
