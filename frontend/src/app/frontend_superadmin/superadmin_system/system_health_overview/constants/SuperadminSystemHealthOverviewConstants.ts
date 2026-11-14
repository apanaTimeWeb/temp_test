// RESPONSIBILITY: Define stable module-owned constants for system health overview; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_system/system_health_overview/constants/SuperadminSystemHealthOverviewConstants.ts -> typed constants -> component/hook/config behavior.
import { AlertTriangle, Clock, CreditCard, Globe, MessageCircle, Cloud, Wifi, Zap } from 'lucide-react';

/** Feature-local visual mapping; sample business/telemetry records are in the mocks folder. */
export const SUPERADMIN_SYSTEM_HEALTH_NETWORK_ICONS = {
  requests: Zap,
  latency: Clock,
  errors: AlertTriangle,
  websockets: Wifi,
} as const;

export const SUPERADMIN_SYSTEM_HEALTH_NETWORK_COLORS = {
  requests: 'text-warning',
  latency: 'text-info',
  errors: 'text-danger',
  websockets: 'text-info',
} as const;

export const SUPERADMIN_SYSTEM_HEALTH_INTEGRATION_ICONS = {
  'payment-gateway': CreditCard,
  'messaging-api': MessageCircle,
  'backup-storage': Cloud,
  'email-service': Globe,
} as const;
