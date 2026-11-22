// FLOW: Feature source -> superadmin_security/security_overview/types/SuperadminSecurityOverviewTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Security Types; defines module-owned type contracts for the named data boundary. */
import type { z } from 'zod';
import type { SUPERADMIN_SECURITY_LOGIN_SCHEMA, SUPERADMIN_SECURITY_PASSWORD_SCHEMA } from '@/app/frontend_superadmin/superadmin_security/security_overview/schemas/SuperadminSecurityOverviewPolicySchema';

/**
 * Defines the public SuperadminSecurityLoginRules contract for security overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminSecurityLoginRules = z.infer<typeof SUPERADMIN_SECURITY_LOGIN_SCHEMA>;
/**
 * Defines the public SuperadminSecurityPasswordPolicy contract for security overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminSecurityPasswordPolicy = z.infer<typeof SUPERADMIN_SECURITY_PASSWORD_SCHEMA>;
