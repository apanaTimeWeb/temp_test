/** Frontend registration request; confirmPassword is intentionally client-only. Backend contract remains host-owned. */
export interface PublicAuthRegistrationRequest { ownerName: string; libraryName: string; email: string; phone: string; password: string; }
/** Field-level validation detail used to route safe errors to known form controls. */
export interface PublicAuthRegistrationValidationError { field: string; message: string; }
/** Frontend response-envelope shape validated by this module; backend compatibility must be confirmed against the host contract. */
export interface PublicAuthRegistrationApiEnvelope { success: boolean; message: string; data: unknown | null; error?: string; errorCode?: string; statusCode?: number; validationErrors?: PublicAuthRegistrationValidationError[]; }
