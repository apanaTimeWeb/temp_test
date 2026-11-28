import type { PublicAuthLoginRequest } from '@/app/public_auth/auth_sign_in/types/PublicAuthSignInApiTypes';

/** Synthetic component-test values only; the reserved .invalid address is not a real account. */
export const PUBLIC_AUTH_SIGN_IN_DEMO: PublicAuthLoginRequest = {
  email: 'person@example.invalid',
  password: 'SyntheticPassword1',
  role: 'admin',
};
