import { registerAs } from '@nestjs/config';
import { getEnv } from './env';

export const mailConfig = registerAs('mail', () => {
  const env = getEnv();
  return {
    driver: env.MAIL_DRIVER,
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    secure: env.MAIL_SECURE,
    user: env.MAIL_USER,
    password: env.MAIL_PASSWORD,
    from: env.MAIL_FROM,
  };
});
