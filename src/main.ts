import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { appConfig } from './configs';

const configService = new ConfigService();
const logger = new Logger('main.ts');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appConfig(app);
  await app.listen(configService.get<number>('APP_PORT') || 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
