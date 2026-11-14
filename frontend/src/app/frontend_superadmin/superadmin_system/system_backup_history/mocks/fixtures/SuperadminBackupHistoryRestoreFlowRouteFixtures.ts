// RESPONSIBILITY: Define local sample fixtures for system backup history; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_system/system_backup_history/mocks/fixtures/SuperadminBackupHistoryRestoreFlowRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINBACKUPRESTORE_ROUTE_FIXTURE = { route: '/superadmin/superadmin_system/backup_history?view=restore', source: 'local-preview' } as const;
