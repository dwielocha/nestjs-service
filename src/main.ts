import { ConsoleLogger, LoggerService } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { MultiLoggerService } from './core/multilogger/multilogger.service';
import { Settings } from 'luxon';
import {
  GoogleCloudLogger,
  GoogleCloudLoggerConfig,
} from './core/multilogger/goggle-cloud-logger';

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || 3000);
const enableCloudLogging = Boolean(process.env.ENABLE_CLOUD_LOGGING || false);
console.log('Is cloud logging enabled?', enableCloudLogging);

Settings.defaultZone = 'Europe/Rome';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useLogger(setupLogger(app.get(MultiLoggerService)));
  app.enableCors();
  app.enableShutdownHooks();

  await app.listen(port, host);
  console.log(`App is running on ${await app.getUrl()}`);
}

function setupLogger(logger: MultiLoggerService): MultiLoggerService {
  logger.add(new ConsoleLogger());

  if (enableCloudLogging) {
    const config: GoogleCloudLoggerConfig = {
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
      applicationId: process.env.GAE_APPLICATION,
      deploymentId: process.env.GAE_DEPLOYMENT_ID,
      environment: process.env.GAE_ENV,
      serviceName: process.env.GAE_SERVICE,
      version: process.env.GAE_VERSION,
    };

    logger.add(new GoogleCloudLogger(config));
  }

  return logger;
}

bootstrap();
