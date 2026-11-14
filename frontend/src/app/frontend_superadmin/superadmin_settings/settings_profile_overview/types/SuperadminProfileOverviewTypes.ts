// FLOW: Feature source -> superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Profile Types; defines module-owned type contracts for the named data boundary. */
import type { SemanticColumnDef as ColDef } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/types/SuperadminProfileOverviewSemanticTableTypes';
import type { SuperadminProfileEditValues } from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/schemas/SuperadminProfileOverviewSchema';

/**
 * Defines the public SuperadminProfileTab contract for profile overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminProfileTab = 'Profile' | 'Edit Profile' | 'Change Password' | '2FA' | 'Login History' | 'Active Sessions' | 'Security Settings';

/**
 * Defines the public SuperadminProfileSecuritySession contract for profile overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property device Value defined by the existing feature-local contract. Declared type: string.
 * @property browser Value defined by the existing feature-local contract. Declared type: string.
 * @property ip Value defined by the existing feature-local contract. Declared type: string.
 * @property lastActive Value defined by the existing feature-local contract. Declared type: string.
 * @property isCurrent Boolean state used by the owning feature. Declared type: boolean.
 * @property location Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminProfileSecuritySession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
  location: string;
}

/**
 * Defines the public SuperadminProfileLoginHistoryItem contract for profile overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: number.
 * @property date Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property ip Value defined by the existing feature-local contract. Declared type: string.
 * @property location Value defined by the existing feature-local contract. Declared type: string.
 * @property status Status value as represented by the existing feature contract. Declared type: 'Success' | 'Failed'.
 * @property browser Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminProfileLoginHistoryItem {
  id: number;
  date: string;
  ip: string;
  location: string;
  status: 'Success' | 'Failed';
  browser: string;
}

/**
 * Defines the public SuperadminProfileBasicPanelsProps contract for profile overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property activeTab Value defined by the existing feature-local contract. Declared type: SuperadminProfileTab.
 * @property onSave Callback for the corresponding user interaction. Declared type: () => void.
 * @property onDirtyChange Callback for the corresponding user interaction. Declared type: (isDirty: boolean) => void.
 */
export interface SuperadminProfileBasicPanelsProps {
  activeTab: SuperadminProfileTab;
  onSave: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

/**
 * Defines the public SuperadminProfileSecurityPanelsProps contract for profile overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property activeTab Value defined by the existing feature-local contract. Declared type: SuperadminProfileTab.
 * @property twoFactorEnabled Value defined by the existing feature-local contract. Declared type: boolean.
 * @property loginAlerts Value defined by the existing feature-local contract. Declared type: boolean.
 * @property loginHistory Value defined by the existing feature-local contract. Declared type: SuperadminProfileLoginHistoryItem[].
 * @property colDefs Value defined by the existing feature-local contract. Declared type: ColDef<SuperadminProfileLoginHistoryItem>[].
 * @property sessions Value defined by the existing feature-local contract. Declared type: SuperadminProfileSecuritySession[].
 * @property onRevokeSession Callback for the corresponding user interaction. Declared type: (id: string) => void.
 */
export interface SuperadminProfileSecurityPanelsProps {
  activeTab: SuperadminProfileTab;
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  loginHistory: SuperadminProfileLoginHistoryItem[];
  colDefs: ColDef<SuperadminProfileLoginHistoryItem>[];
  sessions: SuperadminProfileSecuritySession[];
  onRevokeSession: (id: string) => void;
}

/**
 * Defines the public SuperadminProfileEditFormValues contract for profile overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminProfileEditFormValues = SuperadminProfileEditValues;
