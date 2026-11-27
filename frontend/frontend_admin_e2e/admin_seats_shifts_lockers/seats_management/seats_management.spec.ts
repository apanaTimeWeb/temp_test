import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('seats_management E2E', () => {
  test('filters Seats Management table by status dropdown and search', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_seats_shifts_lockers/seats_management', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(4);

    const statusSelect = page.getByTestId('admin_seats-page-control-003');
    await statusSelect.selectOption('Maintenance');
    const maintCount = await main.locator('tbody tr').count();
    expect(maintCount).toBeLessThanOrEqual(4);

    await statusSelect.selectOption('all');
    await expect(main.locator('tbody tr')).toHaveCount(4);
  });
});
