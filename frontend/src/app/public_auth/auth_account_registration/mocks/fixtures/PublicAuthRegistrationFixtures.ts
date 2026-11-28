import type { PublicAuthRegistrationRequest } from '@/app/public_auth/auth_account_registration/types/PublicAuthRegistrationApiTypes';

/** Reserved .invalid address and synthetic values only; never real credentials. */
export const PUBLIC_AUTH_REGISTRATION_DEMO: PublicAuthRegistrationRequest & { confirmPassword: string } = {
  ownerName: 'Audit User',
  libraryName: 'Example Library',
  email: 'person@example.invalid',
  phone: '+919876543210',
  password: 'SyntheticPassword1',
  confirmPassword: 'SyntheticPassword1',
};
