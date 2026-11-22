// RESPONSIBILITY: Define local sample fixtures for system backup overview; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_system/system_backup_overview/mocks/fixtures/SuperadminBackupOverviewCreateFlowRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINBACKUPCREATE_ROUTE_FIXTURE = { route: '/superadmin/superadmin_system/backup_overview?view=create', source: 'local-preview' } as const;
