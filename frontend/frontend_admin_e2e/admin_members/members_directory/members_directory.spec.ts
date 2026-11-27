import { test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('members_directory E2E', () => {
  test('loads Members Directory page and search cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_members/members_directory', { checkSearchInput: true });
  });
});
