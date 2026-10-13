import z from 'zod';

const port = z.coerce.number().min(1).max(65535);
const emptyToUndefined = (value: unknown): unknown =>
  value === '' ? undefined : value;
const optionalString = z.preprocess(emptyToUndefined, z.string().optional());

export const LOG_LEVELS = [
  'fatal',
  'error',
  'warn',
  'log',
  'debug',
  'verbose',
] as const;

export const envSchema = z.object({
  // Application
  APP_NAME: z.string().min(1).default('Nest App'),
  NODE_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
  APP_PORT: port.default(3000),
  LOG_LEVEL: z.enum(LOG_LEVELS).default('log'),
  QUEUE_WORKER_ENABLED: z.stringbool().default(true),

  // MySQL
  MYSQL_DB_HOST: z.string().min(1),
  MYSQL_DB_PORT: port.default(3306),
  MYSQL_DB_NAME: z.string().min(1),
  MYSQL_DB_USERNAME: z.string().min(1),
  MYSQL_DB_PASSWORD: z.string().min(8),
  MYSQL_DB_POOL_SIZE: z.coerce.number().min(0).max(10).default(0),
  MYSQL_DB_SSL: z.stringbool().default(false),

  // Redis
  REDIS_HOST: z.string().min(1).default('127.0.0.1'),
  REDIS_PORT: port.default(6379),
  REDIS_PASSWORD: optionalString,
  REDIS_DB: z.coerce.number().int().min(0).max(15).default(0),

  // Mail
  MAIL_DRIVER: z.enum(['smtp', 'json']).default('smtp'),
  MAIL_HOST: z.string().min(1).default('127.0.0.1'),
  MAIL_PORT: port.default(2525),
  MAIL_SECURE: z.stringbool().default(false),
  MAIL_USER: optionalString,
  MAIL_PASSWORD: optionalString,
  MAIL_FROM: z.string().min(3).default('Helpdesk <no-reply@helpdesk.local>'),
});

export type Env = z.output<typeof envSchema>;

export function parseEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw);
  if (result.success) {
    return result.data;
  }

  throw new Error(
    `Invalid environment configuration:\n${z.prettifyError(result.error)}`,
  );
}

let cached: Env | undefined;

export function getEnv(): Env {
  if (!cached) {
    try {
      process.loadEnvFile();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error;
      }
    }
    cached = parseEnv(process.env);
  }
  return cached;
}
