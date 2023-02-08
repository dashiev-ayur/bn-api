import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  app.enableCors({
    origin: function (origin, callback) {
      const whitelist = [
        'http://localhost:3001',
        'http://buryatia.name',
        'https://buryatia.name',
      ];
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS ${origin}`));
      }
    },
  });

  const config = new DocumentBuilder()
    .setTitle('API - сайтовый сервис')
    .setDescription(
      `<p>Открытое API для сайта <b>https://buryatia.name</b>.</p>
      <p>API находиться в разработке. Вы можете использовать его на свой страх и риск ).</p>`,
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
