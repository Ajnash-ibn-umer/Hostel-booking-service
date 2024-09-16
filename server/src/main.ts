import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as express from 'express';
import { join } from 'path';
import next from 'next';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('to start');

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.use(compression());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Swagger API Documentation')
    .setDescription('API documentation for API implementation')
    .setVersion('1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(process.env.SWAGGER_DOC_URL ?? 'doc', app, doc, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  //   const dev = ENV.NODE_ENV !== 'production';

  //   const nextApp = next({ dev, conf: { distDir: '.next' } });
  // const handle = nextApp.getRequestHandler();

  // await nextApp.prepare();

  // app.use((req, res, next) => handle(req, res));

  //   // Serve static files
  //   app.use('/public', express.static(join(__dirname, '../../your-nextjs-project/public')));
  //   app.use('/_next', express.static(join(__dirname, '../../your-nextjs-project/.next')));

  ///
  await app
    .listen(process.env.PORT)
    .then(() => console.log(`server running on port ${process.env.PORT}`));
}
bootstrap();
