import type { PublicAuthLoginRequest, PublicAuthApiEnvelope } from '@/app/frontend_public/public_auth/auth_sign_in/types/PublicAuthSignInApiTypes';

/** Synthetic component-test values only; the reserved .invalid address is not a real account. */
export const PUBLIC_AUTH_SIGN_IN_DEMO: PublicAuthLoginRequest = { email: 'person@example.invalid', password: 'SyntheticPassword1', role: 'admin' };
export const PUBLIC_AUTH_SIGN_IN_ACCEPTED: PublicAuthApiEnvelope = { success: true, message: 'Accepted', data: null };
export const PUBLIC_AUTH_SIGN_IN_REJECTED: PublicAuthApiEnvelope = { success: false, message: 'Request rejected', data: null, errorCode: 'REQUEST_REJECTED' };
export const PUBLIC_AUTH_SIGN_IN_INVALID_ENVELOPE = { success: 'not-a-boolean' } as const;
