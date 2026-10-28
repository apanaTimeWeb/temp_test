import type { PublicAuthRole } from '@/app/frontend_public/public_auth/auth_sign_in/utils/PublicAuthSignInConstants';

/** Request shapes represent the fields collected by this frontend only.
 * The backend owner must confirm that these match the real API contract before deployment.
 */
export interface PublicAuthLoginRequest {
  email: string;
  password: string;
  role: PublicAuthRole;
}

/** Field-level validation detail returned by the frontend API envelope contract. */
export interface PublicAuthApiValidationError {
  field: string;
  message: string;
}

/** Envelope required by WEB_FRONTEND_ARCHITECTURE_AND_DEVELOPMENT_RULES_V1.md. */
export interface PublicAuthApiEnvelope {
  success: boolean;
  message: string;
  data: unknown | null;
  error?: string;
  errorCode?: string;
  statusCode?: number;
  validationErrors?: PublicAuthApiValidationError[];
}
