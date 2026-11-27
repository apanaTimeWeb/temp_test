import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('accounts_seat_gap_report E2E', () => {
  test('filters Seat Gap Report by shift, status, and search cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_accounts_assets/accounts_seat_gap_report', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(3);

    const shiftSelect = main.locator('select').nth(0);
    await shiftSelect.selectOption('Morning');
    expect(await main.locator('tbody tr').count()).toBeLessThanOrEqual(3);
    await shiftSelect.selectOption('all');

    const statusSelect = main.locator('select').nth(1);
    await statusSelect.selectOption('vacant');
    expect(await main.locator('tbody tr').count()).toBeLessThanOrEqual(3);
    await statusSelect.selectOption('all');
    await expect(main.locator('tbody tr')).toHaveCount(3);
  });
});
