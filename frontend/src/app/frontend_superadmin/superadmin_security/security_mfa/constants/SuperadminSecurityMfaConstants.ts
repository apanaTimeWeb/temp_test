// FLOW: Feature consumers -> superadmin_security/security_mfa/constants/SuperadminSecurityMfaConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Security Constants; centralizes stable module-owned options and configuration. */
import { Lock, Fingerprint, ListOrdered, Globe, Key, Network, ShieldX } from 'lucide-react';
export const SUPERADMIN_SECURITY_TABS = [
    { name: 'Login Security', labelKey: 'COPY.TAB_LOGIN_SECURITY', icon: Lock },
    { name: 'Password Policy', labelKey: 'COPY.TAB_PASSWORD_POLICY', icon: ListOrdered },
    { name: '2FA & MFA', labelKey: 'COPY.TAB_2FA_MFA', icon: Fingerprint },
    { name: 'IP Firewall', labelKey: 'COPY.TAB_IP_FIREWALL', icon: Globe },
    { name: 'API Keys', labelKey: 'COPY.TAB_API_KEYS', icon: Key },
    { name: 'Active Sessions', labelKey: 'COPY.TAB_ACTIVE_SESSIONS', icon: Network },
    { name: 'Audit & Threats', labelKey: 'COPY.TAB_AUDIT_THREATS', icon: ShieldX },
  ];
