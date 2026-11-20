// RESPONSIBILITY: Define compile-time types for security mfa; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_security/security_mfa/types/SuperadminSecurityMfaPolicyPanelsComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_security/superadmin_security_components/superadmin_security_overview_page/SuperadminSecurityMfaPolicyPanels.tsx. */
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { SuperadminSecurityLoginRules, SuperadminSecurityPasswordPolicy } from '@/app/frontend_superadmin/superadmin_security/security_mfa/types/SuperadminSecurityMfaTypes';

export interface MfaEnrollmentAccount {
  id: string;
  name: string;
  email: string;
  role: 'SuperAdmin' | 'Admin' | 'BranchManager';
  mfaEnabled: boolean;
  method: string;
  enrolledAt: string;
  lastVerified: string;
  status: 'Enforced' | 'Active' | 'Pending_Grace' | 'Exempt';
}

export interface MfaPolicyState {
  enabled: boolean;
  method: string;
  enforceSuperadminsOnly?: boolean;
  requireForAdmins?: boolean;
  stepUpAuth?: boolean;
  gracePeriodDays?: number;
  recoveryCodesGenerated?: boolean;
  recoveryCodes?: string[];
}

/**
 * Defines the public SuperadminSecurityPolicyPanelsProps contract for security mfa. Optionality and nullability follow the declared fields.
 */
export interface SuperadminSecurityPolicyPanelsProps {
  activeTab: string;
  loginRegister: UseFormRegister<SuperadminSecurityLoginRules>;
  loginErrors: FieldErrors<SuperadminSecurityLoginRules>;
  passwordRegister: UseFormRegister<SuperadminSecurityPasswordPolicy>;
  passwordErrors: FieldErrors<SuperadminSecurityPasswordPolicy>;
  twoFA: MfaPolicyState;
  onToggleMfa?: (enabled: boolean) => void;
  onSelectMethod?: (method: string) => void;
  onToggleEnforceSuperadmin?: (enforce: boolean) => void;
  onToggleRequireAdmins?: (require: boolean) => void;
  onToggleStepUp?: (stepUp: boolean) => void;
  onGenerateRecoveryCodes?: () => void;
  enrollmentAccounts?: MfaEnrollmentAccount[];
  handleSave: () => void;
}
