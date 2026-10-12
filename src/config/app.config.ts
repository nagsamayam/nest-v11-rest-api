import { registerAs } from '@nestjs/config';
import { getEnv } from './env';

export const appConfig = registerAs('app', () => {
  const env = getEnv();
  return {
    appEnv: env.APP_NAME,
    isProduction: env.APP_NAME === 'production',
    appPort: env.APP_PORT,
  };
});
