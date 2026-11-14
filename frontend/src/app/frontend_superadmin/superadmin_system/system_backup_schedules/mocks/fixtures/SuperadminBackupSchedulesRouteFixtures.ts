// RESPONSIBILITY: Define local sample fixtures for system backup schedules; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_system/system_backup_schedules/mocks/fixtures/SuperadminBackupSchedulesRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINBACKUPSCHEDULES_ROUTE_FIXTURE = { route: '/superadmin/superadmin_system/backup_schedules', source: 'local-preview' } as const;
