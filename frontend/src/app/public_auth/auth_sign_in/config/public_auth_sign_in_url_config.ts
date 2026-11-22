import type { PublicAuthRole } from '@/app/public_auth/auth_sign_in/utils/PublicAuthSignInConstants';

/** Host-owned login endpoint. Empty means the host has not configured it. */
export const PUBLIC_AUTH_LOGIN_URL = process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH ?? '';

/** Existing public links remain unchanged. The host rewrite table is documented in the domain integration guide. */
export const PUBLIC_AUTH_INTERNAL_URLS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
} as const;

/** Existing post-login destinations are navigation context only, never authorization evidence. */
export const PUBLIC_AUTH_ROLE_REDIRECTS: Record<PublicAuthRole, string> = {
  superadmin: '/superadmin/superadmin_dashboard',
  admin: '/admin',
  manager: '/manager',
} as const;
