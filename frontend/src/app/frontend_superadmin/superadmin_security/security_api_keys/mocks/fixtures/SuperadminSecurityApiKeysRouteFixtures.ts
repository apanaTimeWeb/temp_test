// RESPONSIBILITY: Define local sample fixtures for security api keys; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_security/security_api_keys/mocks/fixtures/SuperadminSecurityApiKeysRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINSECURITYAPIKEYS_ROUTE_FIXTURE = { route: '/superadmin/superadmin_security/security_api_keys', source: 'local-preview' } as const;
