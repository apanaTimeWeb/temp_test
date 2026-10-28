import type { PublicAuthRegistrationRequest, PublicAuthRegistrationApiEnvelope } from '../../types/PublicAuthRegistrationApiTypes';
/** Reserved .invalid address and synthetic values only; never real credentials. */
export const PUBLIC_AUTH_REGISTRATION_DEMO: PublicAuthRegistrationRequest & { confirmPassword: string } = { ownerName: 'Audit User', libraryName: 'Example Library', email: 'person@example.invalid', phone: '+919876543210', password: 'SyntheticPassword1', confirmPassword: 'SyntheticPassword1' };
export const PUBLIC_AUTH_REGISTRATION_ACCEPTED: PublicAuthRegistrationApiEnvelope = { success: true, message: 'Accepted', data: null };
export const PUBLIC_AUTH_REGISTRATION_REJECTED: PublicAuthRegistrationApiEnvelope = { success: false, message: 'Request could not be completed', data: null, errorCode: 'REQUEST_FAILED' };

/** Deliberately malformed test-only response for parser coverage; not a server contract. */
export const PUBLIC_AUTH_REGISTRATION_INVALID_ENVELOPE = { success: 'not-a-boolean' } as const;
