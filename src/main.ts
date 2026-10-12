import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config';
import { ConfigType } from '@nestjs/config';
import { getEnv } from './config/env';
import { configureApp } from './app.setup';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConsoleLogger, LOG_LEVELS, LogLevel } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  // Validate the environment first so a misconfigured deployment fails with a clear message.
  const env = getEnv();
  const isProduction = env.NODE_ENV === 'production';
  // Nest log levels are cumulative: "warn" means fatal + error + warn.
  const logLevels: LogLevel[] = LOG_LEVELS.slice(
    0,
    LOG_LEVELS.indexOf(env.LOG_LEVEL) + 1,
  );

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({
      json: isProduction, // one JSON object per line for log shippers
      colors: !isProduction,
      logLevels,
    }),
  });

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  configureApp(app);
  app.enableShutdownHooks(); // SIGTERM -> drain HTTP, close the queue worker, DB pool and Redis

  await app.listen(config.appPort);
}

bootstrap().catch((error: unknown) => {
  console.error('Fatal error during start-up:', error);
  process.exit(1);
});
