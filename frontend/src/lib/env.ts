import { z } from 'zod';

/**
 * RESPONSIBILITY: Central, zero-business validation of the browser-safe runtime configuration.
 * Only public NEXT_PUBLIC_* values and Next.js NODE_ENV are read here; feature code must not read process.env.
 */
const HttpBaseUrlSchema = z.string().trim().default('').superRefine((value, context) => {
  if (!value) return; // Empty means same-origin API routes, which is the existing transport behavior.
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'NEXT_PUBLIC_API_BASE_URL must be an absolute HTTP(S) URL or empty for same-origin requests.' });
    return;
  }
  if ((parsed.protocol !== 'https:' && parsed.protocol !== 'http:') || parsed.username || parsed.password) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'NEXT_PUBLIC_API_BASE_URL must use HTTP(S) and must not contain credentials.' });
  }
});

export const FrontendRuntimeConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_API_BASE_URL: HttpBaseUrlSchema,
  NEXT_PUBLIC_FRONTEND_DEMO_MODE: z.enum(['true', 'false']).default('false'),
});

export type FrontendRuntimeConfig = z.infer<typeof FrontendRuntimeConfigSchema>;

/** Parse the explicitly supplied environment shape; exported for direct, deterministic tests. */
export function parseFrontendRuntimeConfig(source: Record<string, string | undefined>): FrontendRuntimeConfig {
  return FrontendRuntimeConfigSchema.parse(source);
}

/** Next.js statically substitutes these direct public env references at build time. */
export const frontendRuntimeConfig = parseFrontendRuntimeConfig({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_FRONTEND_DEMO_MODE: process.env.NEXT_PUBLIC_FRONTEND_DEMO_MODE,
});
