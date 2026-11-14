// RESPONSIBILITY: Define local sample fixtures for users directory; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_users/users_directory/mocks/fixtures/SuperadminUsersDirectoryRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINUSERSDIRECTORY_ROUTE_FIXTURE = { route: '/superadmin/superadmin_users/users_directory', source: 'local-preview' } as const;
