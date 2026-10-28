/** Host-owned recovery endpoint; deliberately empty when not configured. No endpoint is inferred here. */
export const PUBLIC_AUTH_PASSWORD_RECOVERY_API_PATH = process.env.NEXT_PUBLIC_AUTH_FORGOT_PASSWORD_PATH ?? '';

/** Existing public page paths are retained from the supplied auth source. */
export const PUBLIC_AUTH_PASSWORD_RECOVERY_URLS = {
  FORGOT_PASSWORD: '/auth/forgot-password',
  LOGIN: '/auth/login',
  RESET_PASSWORD: '/auth/reset-password',
} as const;
