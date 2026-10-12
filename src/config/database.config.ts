import { registerAs } from '@nestjs/config';
import { getEnv } from './env';

export interface DatabaseSettings {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  poolSize: number;
  ssl: boolean;
}

export function readDatabaseSettings(): DatabaseSettings {
  const env = getEnv();
  return {
    host: env.MYSQL_DB_HOST,
    port: env.MYSQL_DB_PORT,
    database: env.MYSQL_DB_NAME,
    username: env.MYSQL_DB_USERNAME,
    password: env.MYSQL_DB_PASSWORD,
    poolSize: env.MYSQL_DB_POOL_SIZE,
    ssl: env.MYSQL_DB_SSL,
  };
}

export const databaseConfig = registerAs('database', readDatabaseSettings);
