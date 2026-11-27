import { test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('finance_auto_suspend E2E', () => {
  test('loads Auto-Suspend Defaulters page and search cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_finance/finance_auto_suspend', { checkSearchInput: true });
  });
});
