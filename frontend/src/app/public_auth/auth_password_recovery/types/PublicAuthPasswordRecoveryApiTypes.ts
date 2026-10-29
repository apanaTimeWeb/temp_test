/** Request body observed in the supplied recovery implementation. Do not add fields without backend evidence. */
export interface PublicAuthPasswordRecoveryRequest {
  identity: string;
}

/** Field-level validation detail used to route safe errors to known form controls. */
export interface PublicAuthPasswordRecoveryValidationError {
  field: string;
  message: string;
}

/** Mirrors the currently required frontend API envelope; backend-specific fields remain unconfirmed. */
export interface PublicAuthPasswordRecoveryApiEnvelope {
  success: boolean;
  message: string;
  data: unknown | null;
  error?: string;
  errorCode?: string;
  statusCode?: number;
  validationErrors?: PublicAuthPasswordRecoveryValidationError[];
}
