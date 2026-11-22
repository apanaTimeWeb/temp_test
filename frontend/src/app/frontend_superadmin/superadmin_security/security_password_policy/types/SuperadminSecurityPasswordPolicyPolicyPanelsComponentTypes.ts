// RESPONSIBILITY: Define compile-time types for security password policy; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_security/security_password_policy/types/SuperadminSecurityPasswordPolicyPolicyPanelsComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_security/superadmin_security_components/superadmin_security_overview_page/SuperadminSecurityPasswordPolicyPolicyPanels.tsx. */
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { SuperadminSecurityLoginRules, SuperadminSecurityPasswordPolicy } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/types/SuperadminSecurityPasswordPolicyTypes';

/**
 * Defines the public SuperadminSecurityPolicyPanelsProps contract for security password policy. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property activeTab Value defined by the existing feature-local contract. Declared type: string.
 * @property loginRegister Value defined by the existing feature-local contract. Declared type: UseFormRegister<SuperadminSecurityLoginRules>.
 * @property loginErrors User-safe error or explanatory message; raw exception details are not implied. Declared type: FieldErrors<SuperadminSecurityLoginRules>.
 * @property passwordRegister Value defined by the existing feature-local contract. Declared type: UseFormRegister<SuperadminSecurityPasswordPolicy>.
 * @property passwordErrors User-safe error or explanatory message; raw exception details are not implied. Declared type: FieldErrors<SuperadminSecurityPasswordPolicy>.
 * @property twoFA Value defined by the existing feature-local contract. Declared type: { enabled: boolean; method: string; }.
 * @property handleSave Value defined by the existing feature-local contract. Declared type: () => void.
 */
export interface SuperadminSecurityPolicyPanelsProps {
  activeTab: string;
  loginRegister: UseFormRegister<SuperadminSecurityLoginRules>;
  loginErrors: FieldErrors<SuperadminSecurityLoginRules>;
  passwordRegister: UseFormRegister<SuperadminSecurityPasswordPolicy>;
  passwordErrors: FieldErrors<SuperadminSecurityPasswordPolicy>;
  twoFA: { enabled: boolean; method: string };
  handleSave: () => void;
}
