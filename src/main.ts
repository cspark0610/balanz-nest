import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const port = parseInt(process.env.PORT) || 3000;
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new WsAdapter(app));

  app.setGlobalPrefix('api/v1');
  await app.listen(port, () => {
    console.log('listening on port ', process.env.PORT);
  });
}
bootstrap();
