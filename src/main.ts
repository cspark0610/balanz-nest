import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = parseInt(process.env.PORT) || 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  app.setGlobalPrefix('api/v1');
  await app.listen(port, () => {
    console.log('listening on port ', process.env.PORT);
  });
}
bootstrap();
