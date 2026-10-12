import { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';

export function configureApp(app: NestExpressApplication): void {
  app.disable('x-powered-by');

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
}
