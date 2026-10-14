import { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';
import { requestContext } from './common/middleware/request-context.middleware';

export function configureApp(app: NestExpressApplication): void {
  app.disable('x-powered-by');

  app.use(requestContext());

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
}
