// RESPONSIBILITY: Define local sample fixtures for navigation shell; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_navigation/navigation_shell/mocks/fixtures/SuperadminNavigationShellPreviewAlerts.ts -> typed local fixtures -> screen rendering or assertions.
/** Synthetic shell alert content for source-only preview; not live monitoring events. */
export const SUPERADMIN_NAVIGATION_PREVIEW_ALERTS = [
  { id: 'sample-deployment', titleKey: 'COPY.SAMPLE_DEPLOYMENT_EVENT', timeKey: 'COPY.DEMO_TIMESTAMP', tone: 'success', unread: true },
  { id: 'sample-connection', titleKey: 'COPY.SAMPLE_CONNECTION_ALERT', timeKey: 'COPY.DEMO_TIMESTAMP', tone: 'danger', unread: true },
  { id: 'sample-backup', titleKey: 'COPY.SAMPLE_BACKUP_EVENT', timeKey: 'COPY.DEMO_NOTIFICATION_ONLY', tone: 'primary', unread: false },
] as const;
