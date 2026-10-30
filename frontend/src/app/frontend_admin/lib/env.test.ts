import { describe, expect, it } from 'vitest';
import { FrontendRuntimeConfigSchema, parseFrontendRuntimeConfig } from '@/lib/env';

describe('frontend runtime configuration', () => {
  it('defaults to same-origin API calls and disabled demo mode', () => {
    expect(parseFrontendRuntimeConfig({ NODE_ENV: 'test' })).toEqual({
      NODE_ENV: 'test',
      NEXT_PUBLIC_API_BASE_URL: '',
      NEXT_PUBLIC_FRONTEND_DEMO_MODE: 'false',
    });
  });

  it('accepts explicit public HTTP(S) API base URLs', () => {
    expect(parseFrontendRuntimeConfig({ NODE_ENV: 'production', NEXT_PUBLIC_API_BASE_URL: 'https://api.example.test/v1', NEXT_PUBLIC_FRONTEND_DEMO_MODE: 'false' }).NEXT_PUBLIC_API_BASE_URL).toBe('https://api.example.test/v1');
    expect(parseFrontendRuntimeConfig({ NODE_ENV: 'development', NEXT_PUBLIC_API_BASE_URL: 'http://localhost:3000', NEXT_PUBLIC_FRONTEND_DEMO_MODE: 'true' }).NEXT_PUBLIC_FRONTEND_DEMO_MODE).toBe('true');
  });

  it('rejects malformed, non-HTTP, or credential-bearing API URLs', () => {
    for (const value of ['not a url', 'ftp://api.example.test', 'https://user:pass@api.example.test']) {
      expect(FrontendRuntimeConfigSchema.safeParse({ NODE_ENV: 'test', NEXT_PUBLIC_API_BASE_URL: value, NEXT_PUBLIC_FRONTEND_DEMO_MODE: 'false' }).success).toBe(false);
    }
  });

  it('rejects invalid NODE_ENV and demo flag values', () => {
    expect(FrontendRuntimeConfigSchema.safeParse({ NODE_ENV: 'staging', NEXT_PUBLIC_FRONTEND_DEMO_MODE: 'false' }).success).toBe(false);
    expect(FrontendRuntimeConfigSchema.safeParse({ NODE_ENV: 'test', NEXT_PUBLIC_FRONTEND_DEMO_MODE: 'yes' }).success).toBe(false);
  });
});
