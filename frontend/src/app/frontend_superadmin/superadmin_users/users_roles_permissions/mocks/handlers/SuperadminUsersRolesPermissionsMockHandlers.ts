// RESPONSIBILITY: Define isolated mock handlers for users roles permissions; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_users/users_roles_permissions/mocks/handlers/SuperadminUsersRolesPermissionsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINUSERSROLESPERMISSIONS_MOCK_HANDLERS: readonly never[] = [];
