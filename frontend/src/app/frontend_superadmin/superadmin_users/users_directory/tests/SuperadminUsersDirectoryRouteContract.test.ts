// RESPONSIBILITY: Define source-level test coverage for users directory using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_users/users_directory/tests/SuperadminUsersDirectoryRouteContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_USERS_DIRECTORY_ROUTES as __SUPERADMIN_USERS_DIRECTORY_ROUTES } from "@/app/frontend_superadmin/superadmin_users/users_directory/config/superadmin_users_directory.url_config";

describe('users_directory route contract', () => { it('owns its canonical refreshable route', () => { expect(__SUPERADMIN_USERS_DIRECTORY_ROUTES.SUPERADMIN_USERS_DIRECTORY_URLS.PAGE).toBe('/superadmin/superadmin_users/users_directory'); expect(__SUPERADMIN_USERS_DIRECTORY_ROUTES.SUPERADMIN_USERS_DIRECTORY_URLS.SCREEN).toBe(__SUPERADMIN_USERS_DIRECTORY_ROUTES.SUPERADMIN_USERS_DIRECTORY_URLS.PAGE); }); });
