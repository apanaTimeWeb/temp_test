// FLOW: Feature consumers -> superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewHealthConstants.ts -> typed constants -> component/hook/config behavior.
/** Responsibility: Superadmin Dashboard Health Constants; centralizes stable module-owned options and configuration. */
import { CheckCircle, Users, Zap, HardDrive } from 'lucide-react';
export const SUPERADMIN_DASHBOARD_HEALTH_METRICS = [
  { key: 'uptime',      labelKey: 'COPY.SAMPLE_UPTIME',    icon: CheckCircle, colorCls: 'sa-metric--success' },
  { key: 'activeUsers', labelKey: 'COPY.SAMPLE_ACTIVE_USERS', icon: Users,       colorCls: 'sa-metric--primary' },
  { key: 'apiLatency',  labelKey: 'COPY.SAMPLE_API_LATENCY', icon: Zap,         colorCls: 'sa-metric--info' },
  { key: 'lastBackup',  labelKey: 'COPY.SAMPLE_LAST_BACKUP', icon: HardDrive,   colorCls: 'sa-metric--muted' },
] as const;
