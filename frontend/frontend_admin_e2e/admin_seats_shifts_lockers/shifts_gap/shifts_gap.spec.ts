import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('shifts_gap E2E', () => {
  test('filters Shift Gap overstay audit rows and shift analytics dropdown', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_seats_shifts_lockers/shifts_gap', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(6);

    const shiftSelect = page.getByTestId('admin_shifts-page-control-001');
    await shiftSelect.selectOption('Morning');
    await shiftSelect.selectOption('All');
    await expect(main.locator('tbody tr')).toHaveCount(6);
  });
});
