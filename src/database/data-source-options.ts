import { join } from 'path';
import { DatabaseSettings } from '../config/database.config';
import { User } from '../users/user.entity';
import { DataSourceOptions } from 'typeorm';

export function buildDataSourceOptions(
  db: DatabaseSettings,
): DataSourceOptions {
  return {
    type: 'mysql',
    host: db.host,
    port: db.port,
    database: db.database,
    username: db.username,
    password: db.password,
    poolSize: db.poolSize,
    ssl: db.ssl
      ? { rejectUnauthorized: true, minVersion: 'TLSv1.2' }
      : undefined,
    charset: 'utf8mb4',
    timezone: 'Z',
    connectTimeout: 10_000,
    extra: {
      waitForConnections: true,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10_000,
    },
    entities: [User],
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    migrationsTableName: 'migrations',
    migrationsRun: false,

    logging: ['error', 'warn', 'migration'],
    synchronize: false,
    maxQueryExecutionTime: 1_000,
  };
}
