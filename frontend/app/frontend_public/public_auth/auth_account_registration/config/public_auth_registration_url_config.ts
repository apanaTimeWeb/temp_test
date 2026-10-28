/** Host-owned API path; deliberately empty when not configured. */
export const PUBLIC_AUTH_REGISTRATION_API_PATH = process.env.NEXT_PUBLIC_AUTH_SIGNUP_PATH ?? '';
/** Existing routes/destination are preserved exactly from the supplied source. */
export const PUBLIC_AUTH_REGISTRATION_URLS = { SIGNUP: '/auth/signup', LOGIN: '/auth/login', POST_SUCCESS: '/superadmin/superadmin_setup-wizard' } as const;
