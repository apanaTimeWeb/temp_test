import { test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('accounts_daily_settlement E2E', () => {
  test('loads Daily Cash Settlement & Handover Audit page cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_accounts_assets/accounts_daily_settlement', { checkSearchInput: true });
  });
});
