import { test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('accounts_seat_gap_report E2E', () => {
  test('loads Seat Gap Report page and search cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_accounts_assets/accounts_seat_gap_report', { checkSearchInput: true });
  });
});
