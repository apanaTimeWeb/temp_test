import { test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('members_coupons E2E', () => {
  test('loads Promotional Coupons page cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_members/members_coupons', { checkSearchInput: true });
  });
});
