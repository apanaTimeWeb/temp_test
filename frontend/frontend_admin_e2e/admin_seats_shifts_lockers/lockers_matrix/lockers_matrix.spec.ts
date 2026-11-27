import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('lockers_matrix E2E', () => {
  test('toggles Locker Grid/Table view, filters status, and opens Locker detail modal', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_seats_shifts_lockers/lockers_matrix', { checkSearchInput: true });

    const main = page.getByRole('main');
    await main.getByRole('button', { name: 'Available Free' }).click();
    await main.getByRole('button', { name: 'Occupied' }).click();
    await main.getByRole('button', { name: 'All Lockers' }).click();

    await main.getByRole('button', { name: 'Table View' }).click();
    expect(await main.locator('tbody tr').count()).toBeGreaterThan(0);
    await main.getByRole('button', { name: 'Grid View' }).click();

    await page.getByTestId('admin_lockers-locker-01').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
