import { LoggerService } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || 3000);
const enableCloudLogging = Boolean(process.env.ENABLE_CLOUD_LOGGING || false);

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors();
  app.enableShutdownHooks();

  await app.listen(port, host);
  console.log(`App is running on ${await app.getUrl()}`);
}

bootstrap();
