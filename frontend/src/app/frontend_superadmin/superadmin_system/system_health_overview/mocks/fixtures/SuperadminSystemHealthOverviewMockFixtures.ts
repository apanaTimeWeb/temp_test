// FLOW: Feature preview/test -> superadmin_system/system_health_overview/mocks/fixtures/SuperadminSystemHealthOverviewMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Responsibility: Superadmin System Health Fixtures; supplies module-owned mock fixtures or handler behavior only. */
import type {
  SuperadminSystemHealthCronFixture,
  SuperadminSystemHealthDatabaseFixture,
  SuperadminSystemHealthInfrastructureFixture,
  SuperadminSystemHealthIntegrationFixture,
  SuperadminSystemHealthNetworkKpiFixture,
} from '@/app/frontend_superadmin/superadmin_system/system_health_overview/types/SuperadminSystemHealthOverviewTypes';

/** Synthetic infrastructure readings. These are never live telemetry. */
export const SUPERADMIN_SYSTEM_HEALTH_INFRA_FIXTURE: SuperadminSystemHealthInfrastructureFixture[] = [
  { id: 'app-server-a', name: 'App Server (sample zone A)', nameKey: 'COPY.APP_SERVER_SAMPLE_ZONE_A', type: 'Compute', usage: 45, status: 'Healthy', ping: '12ms' },
  { id: 'app-server-b', name: 'App Server (sample zone B)', nameKey: 'COPY.APP_SERVER_SAMPLE_ZONE_B', type: 'Compute', usage: 68, status: 'Healthy', ping: '14ms' },
  { id: 'background-worker', name: 'Worker Node (sample background jobs)', nameKey: 'COPY.WORKER_NODE_SAMPLE_BACKGROUND_JOBS', type: 'Compute', usage: 92, status: 'Warning', ping: '45ms' },
];

export const SUPERADMIN_SYSTEM_HEALTH_DATABASE_FIXTURE: SuperadminSystemHealthDatabaseFixture[] = [
  { id: 'postgres-primary', name: 'PostgreSQL Primary Cluster (sample)', nameKey: 'COPY.POSTGRESQL_PRIMARY_CLUSTER_SAMPLE', type: 'Database', metric: 'Connections', metricKey: 'COPY.CONNECTIONS', val: '840 / 1000', pct: 84, status: 'Healthy' },
  { id: 'redis-cache', name: 'Redis Cache Layer (sample)', nameKey: 'COPY.REDIS_CACHE_LAYER_SAMPLE', type: 'Cache', metric: 'Hit Rate', metricKey: 'COPY.HIT_RATE', val: '98.5%', pct: 98, status: 'Healthy' },
  { id: 'block-storage', name: 'Block Storage (sample volume)', nameKey: 'COPY.BLOCK_STORAGE_SAMPLE_VOLUME', type: 'Storage', metric: 'Capacity', metricKey: 'COPY.CAPACITY', val: '4.2TB / 5TB', pct: 84, status: 'Healthy' },
];

export const SUPERADMIN_SYSTEM_HEALTH_NETWORK_KPIS: SuperadminSystemHealthNetworkKpiFixture[] = [
  { id: 'requests', label: 'Sample Current RPS', labelKey: 'COPY.SAMPLE_CURRENT_RPS', value: '1,240', unit: 'req/s', trend: 'Illustrative', trendKey: 'COPY.ILLUSTRATIVE' },
  { id: 'latency', label: 'Sample Average Latency', labelKey: 'COPY.SAMPLE_AVERAGE_LATENCY', value: '45', unit: 'ms', trend: 'Illustrative', trendKey: 'COPY.ILLUSTRATIVE' },
  { id: 'errors', label: 'Sample Error Rate (5xx)', labelKey: 'COPY.SAMPLE_ERROR_RATE_5XX', value: '0.01', unit: '%', trend: 'Illustrative', trendKey: 'COPY.ILLUSTRATIVE' },
  { id: 'websockets', label: 'Sample WebSockets', labelKey: 'COPY.SAMPLE_WEBSOCKETS', value: '8,432', unit: 'conns', trend: 'Illustrative', trendKey: 'COPY.ILLUSTRATIVE' },
];

export const SUPERADMIN_SYSTEM_HEALTH_INTEGRATIONS: SuperadminSystemHealthIntegrationFixture[] = [
  { id: 'payment-gateway', name: 'Payment Gateway (sample)', nameKey: 'COPY.PAYMENT_GATEWAY_SAMPLE', status: 'Not connected', statusKey: 'COPY.NOT_CONNECTED', latency: '—', uptime: '—' },
  { id: 'messaging-api', name: 'Messaging API (sample)', nameKey: 'COPY.MESSAGING_API_SAMPLE', status: 'Not connected', statusKey: 'COPY.NOT_CONNECTED', latency: '—', uptime: '—' },
  { id: 'backup-storage', name: 'Backup Storage (sample)', nameKey: 'COPY.BACKUP_STORAGE_SAMPLE', status: 'Not connected', statusKey: 'COPY.NOT_CONNECTED', latency: '—', uptime: '—' },
  { id: 'email-service', name: 'Email Service (sample)', nameKey: 'COPY.EMAIL_SERVICE_SAMPLE', status: 'Not connected', statusKey: 'COPY.NOT_CONNECTED', latency: '—', uptime: '—' },
];

export const SUPERADMIN_SYSTEM_HEALTH_CRON_JOBS: SuperadminSystemHealthCronFixture[] = [
  { id: 'database-backup', name: 'Daily DB Snapshot Backup (sample)', nameKey: 'COPY.DAILY_DB_SNAPSHOT_BACKUP_SAMPLE', schedule: 'Sample schedule', scheduleKey: 'COPY.SAMPLE_SCHEDULE', lastRun: 'Not verified', lastRunKey: 'COPY.NOT_VERIFIED', duration: '—', status: 'Not connected', statusKey: 'COPY.NOT_CONNECTED' },
  { id: 'subscription-renewal', name: 'Subscription Auto-Renewal (sample)', nameKey: 'COPY.SUBSCRIPTION_AUTO_RENEWAL_SAMPLE', schedule: 'Sample schedule', scheduleKey: 'COPY.SAMPLE_SCHEDULE', lastRun: 'Not verified', lastRunKey: 'COPY.NOT_VERIFIED', duration: '—', status: 'Not connected', statusKey: 'COPY.NOT_CONNECTED' },
  { id: 'session-cleanup', name: 'Session Cleanup (sample)', nameKey: 'COPY.SESSION_CLEANUP_SAMPLE', schedule: 'Sample schedule', scheduleKey: 'COPY.SAMPLE_SCHEDULE', lastRun: 'Not verified', lastRunKey: 'COPY.NOT_VERIFIED', duration: '—', status: 'Not connected', statusKey: 'COPY.NOT_CONNECTED' },
  { id: 'invoice-reminders', name: 'Invoice Reminders (sample)', nameKey: 'COPY.INVOICE_REMINDERS_SAMPLE', schedule: 'Sample schedule', scheduleKey: 'COPY.SAMPLE_SCHEDULE', lastRun: 'Not verified', lastRunKey: 'COPY.NOT_VERIFIED', duration: '—', status: 'Not connected', statusKey: 'COPY.NOT_CONNECTED' },
];
