import z from 'zod';

const port = z.coerce.number().min(1).max(65535);

export const envSchema = z.object({
  APP_NAME: z.string().min(1).default('Nest App'),
  NODE_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
  APP_PORT: port.default(3000),

  MYSQL_DB_HOST: z.string().min(1),
  MYSQL_DB_PORT: port.default(3306),
  MYSQL_DB_NAME: z.string().min(1),
  MYSQL_DB_USERNAME: z.string().min(1),
  MYSQL_DB_PASSWORD: z.string().min(8),
  MYSQL_DB_POOL_SIZE: z.coerce.number().min(0).max(10).default(0),
  MYSQL_DB_SSL: z.stringbool().default(false),
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
