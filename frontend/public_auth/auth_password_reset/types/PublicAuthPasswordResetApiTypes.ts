/** Observed reset request body. OTP is submitted with the new password; no separate OTP endpoint is defined. */
export interface PublicAuthPasswordResetRequest { otp: string; newPassword: string; }
/** Field-level validation detail used to route safe errors to known form controls. */
export interface PublicAuthPasswordResetValidationError { field: string; message: string; }
/** Frontend response-envelope shape validated by this module; backend compatibility must be confirmed against the host contract. */
export interface PublicAuthPasswordResetApiEnvelope { success: boolean; message: string; data: unknown | null; error?: string; errorCode?: string; statusCode?: number; validationErrors?: PublicAuthPasswordResetValidationError[]; }
