// RESPONSIBILITY: Define compile-time types for security threats; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_security/security_threats/types/SuperadminSecurityThreatsOperationsPanelsComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Types for the reachable Audit & Threats preview panel. */
export type SuperadminSecurityFailedLogin = {
  id: number;
  ip: string;
  user: string;
  time: string;
  reason: string;
};

/** Local presentation contract; does not describe a durable API response. */
export interface SuperadminSecurityOperationsPanelsProps {
  failedLogins: readonly SuperadminSecurityFailedLogin[];
  handleExportLogs: () => void;
}
