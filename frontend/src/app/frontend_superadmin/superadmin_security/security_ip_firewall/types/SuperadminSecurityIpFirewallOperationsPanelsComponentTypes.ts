// RESPONSIBILITY: Define compile-time types for security ip firewall; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_security/security_ip_firewall/types/SuperadminSecurityIpFirewallOperationsPanelsComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Component and local state types extracted from superadmin_security/superadmin_security_components/superadmin_security_overview_page/SuperadminSecurityIpFirewallOperationsPanels.tsx. */
export type SuperadminSecurityIpRule = { id: number; ip: string; type: 'BLOCKED' | 'ALLOWED'; reason: string; date: string };

/**
 * Defines the public SuperadminSecurityApiKey contract for security ip firewall. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property name Display label for the owning feature. Declared type: string.
 * @property prefix Value defined by the existing feature-local contract. Declared type: string.
 * @property lastUsed Value defined by the existing feature-local contract. Declared type: string.
 * @property status Status value as represented by the existing feature contract. Declared type: string.
 */
export type SuperadminSecurityApiKey = { id: string; name: string; prefix: string; lastUsed: string; status: string };

/**
 * Defines the public SuperadminSecuritySession contract for security ip firewall. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: number.
 * @property ip Value defined by the existing feature-local contract. Declared type: string.
 * @property device Value defined by the existing feature-local contract. Declared type: string.
 * @property time Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property location Value defined by the existing feature-local contract. Declared type: string.
 * @property user Value defined by the existing feature-local contract. Declared type: string.
 */
export type SuperadminSecuritySession = { id: number; ip: string; device: string; time: string; location: string; user: string };

/**
 * Defines the public SuperadminSecurityFailedLogin contract for security ip firewall. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: number.
 * @property ip Value defined by the existing feature-local contract. Declared type: string.
 * @property user Value defined by the existing feature-local contract. Declared type: string.
 * @property time Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property reason Value defined by the existing feature-local contract. Declared type: string.
 */
export type SuperadminSecurityFailedLogin = { id: number; ip: string; user: string; time: string; reason: string };

/**
 * Defines the public SuperadminSecurityOperationsPanelsProps contract for security ip firewall. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property activeTab Value defined by the existing feature-local contract. Declared type: string.
 * @property newIp Value defined by the existing feature-local contract. Declared type: string.
 * @property setNewIp Value defined by the existing feature-local contract. Declared type: (value: string) => void.
 * @property ipRules Value defined by the existing feature-local contract. Declared type: readonly SuperadminSecurityIpRule[].
 * @property apiKeys Value defined by the existing feature-local contract. Declared type: readonly SuperadminSecurityApiKey[].
 * @property sessions Value defined by the existing feature-local contract. Declared type: readonly SuperadminSecuritySession[].
 * @property failedLogins Value defined by the existing feature-local contract. Declared type: readonly SuperadminSecurityFailedLogin[].
 * @property handleAddIp Value defined by the existing feature-local contract. Declared type: () => void.
 * @property handleForceLogout Value defined by the existing feature-local contract. Declared type: (id: number) => void.
 * @property handleExportLogs Value defined by the existing feature-local contract. Declared type: () => void.
 * @property showToast Value defined by the existing feature-local contract. Declared type: (message: string) => void.
 */
export interface SuperadminSecurityOperationsPanelsProps {
  activeTab: string;
  newIp: string;
  setNewIp: (value: string) => void;
  ipRules: readonly SuperadminSecurityIpRule[];
  apiKeys: readonly SuperadminSecurityApiKey[];
  sessions: readonly SuperadminSecuritySession[];
  failedLogins: readonly SuperadminSecurityFailedLogin[];
  handleAddIp: () => void;
  handleForceLogout: (id: number) => void;
  handleExportLogs: () => void;
  showToast: (message: string) => void;
}
