/** Host-owned API endpoint. An empty value is intentional when the host has not configured it. */
export const PUBLIC_AUTH_PASSWORD_RESET_API_PATH = process.env.NEXT_PUBLIC_AUTH_RESET_PASSWORD_PATH ?? '';
/** Existing public page paths are preserved verbatim. */
export const PUBLIC_AUTH_PASSWORD_RESET_URLS = { LOGIN: '/auth/login', FORGOT_PASSWORD: '/auth/forgot-password' } as const;
