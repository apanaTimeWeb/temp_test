// RESPONSIBILITY: Define stable module-owned constants for users directory; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_users/users_directory/constants/SuperadminUsersDirectoryStaticConstants.ts -> typed constants -> component/hook/config behavior.


/** Static module-owned options/status mapping extracted from SuperadminUsersDirectoryPageClient.tsx. */
export const SUPERADMIN_USERS_OVERVIEW_PAGE_CLIENT_COLUMNS = ['id', 'name', 'username', 'email', 'role', 'branch', 'status', 'lastLogin', 'twoFactor'];
