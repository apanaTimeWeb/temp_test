// RESPONSIBILITY: Define isolated mock handlers for users directory; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_users/users_directory/mocks/handlers/SuperadminUsersDirectoryMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINUSERSDIRECTORY_MOCK_HANDLERS: readonly never[] = [];
