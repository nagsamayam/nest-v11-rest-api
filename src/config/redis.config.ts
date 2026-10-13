import { registerAs } from '@nestjs/config';
import { getEnv } from './env';

export const redisConfig = registerAs('redis', () => {
  const env = getEnv();
  return {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    passwrod: env.REDIS_PASSWORD,
    db: env.REDIS_DB,
  };
});
