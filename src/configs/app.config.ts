import {
  VersioningType,
  INestApplication,
  ValidationPipeOptions,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { firebaseConfig } from './firebase.config';

const configService = new ConfigService();

type Options = {
  validationOpts?: ValidationPipeOptions;
};

export const appConfig = (
  app: INestApplication,
  opts?: Options,
): INestApplication => {
  // initialize firebase
  firebaseConfig();

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
    prefix: 'api/v',
  });

  if (process.env.ENV !== 'PRODUCTION') {
    const config = new DocumentBuilder()
      .setTitle('APIs')
      .setDescription('APIs documents')
      .setVersion('1.0')
      .addBearerAuth()
      .addSecurityRequirements('bearer')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  return app;
};
