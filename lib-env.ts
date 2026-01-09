// lib/env.ts
// Typed environment variable validation

import { z } from 'zod';

const envSchema = z.object({
  // Required
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  APP_PASSWORD: z.string().min(32, 'APP_PASSWORD must be at least 32 characters'),
  APP_COOKIE_SECRET: z.string().min(32, 'APP_COOKIE_SECRET must be at least 32 characters'),

  // Optional with defaults
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_COOKIE_TTL_DAYS: z.coerce.number().positive().default(14),
  OPENAI_MODEL_PRIMARY: z.string().default('gpt-5.2-pro'),
  OPENAI_MODEL_FAST: z.string().default('gpt-4o-mini'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  MOCK_OPENAI: z.enum(['true', 'false']).transform((v) => v === 'true').default('false'),
  MAX_COST_USD_PER_SESSION: z.coerce.number().positive().default(2.5),
  WEB_SEARCH_CACHE_TTL_HOURS: z.coerce.number().positive().default(24),
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  try {
    const parsed = envSchema.parse(process.env);
    cachedEnv = parsed;
    return parsed;
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error('Environment validation failed:');
      err.errors.forEach((e) => {
        console.error(`  ${e.path.join('.')}: ${e.message}`);
      });
    }
    throw new Error('Failed to validate environment variables');
  }
}
