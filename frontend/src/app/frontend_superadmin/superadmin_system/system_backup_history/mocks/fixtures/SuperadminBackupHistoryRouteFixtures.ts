// RESPONSIBILITY: Define local sample fixtures for system backup history; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_system/system_backup_history/mocks/fixtures/SuperadminBackupHistoryRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINBACKUPHISTORY_ROUTE_FIXTURE = { route: '/superadmin/superadmin_system/backup_history', source: 'local-preview' } as const;
