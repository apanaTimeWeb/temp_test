/** PublicAuth-owned, non-secret UI configuration. Credentials and OTPs must never live here. */
/** Fixed role choices accepted by the public login form; they are not authorization evidence. */
export const PUBLIC_AUTH_ROLE_IDS = ['superadmin', 'admin', 'manager'] as const;

/** Literal union of the approved role selector IDs. */
export type PublicAuthRole = (typeof PUBLIC_AUTH_ROLE_IDS)[number];



/** Stable identities for the four fixed positions in the password-strength meter. */
export const PUBLIC_AUTH_PASSWORD_STRENGTH_SEGMENT_IDS = ['segment-one', 'segment-two', 'segment-three', 'segment-four'] as const;
