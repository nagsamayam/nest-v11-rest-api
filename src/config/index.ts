import { appConfig } from './app.config';
import { databaseConfig } from './database.config';
import { mailConfig } from './mail.config';
import { redisConfig } from './redis.config';

export { appConfig, databaseConfig, redisConfig, mailConfig };
export const configurations = [
  appConfig,
  databaseConfig,
  redisConfig,
  mailConfig,
];
