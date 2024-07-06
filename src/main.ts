import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Geo Guessr')
    .setDescription('The Geo Guessr API description')
    .setVersion('1.0')
    .addTag('geoguessr')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(
    process.env.PORT || 3000,
    process.env.HOST || '0.0.0.0',
    function () {
      console.log('Server started.......');
    },
  );
}

bootstrap();
