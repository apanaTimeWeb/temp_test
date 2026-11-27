import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('seats_matrix E2E', () => {
  test('switches shift tabs, toggles Table/Floor view, filters status, and opens bulk generator', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_seats_shifts_lockers/seats_matrix', { checkSearchInput: true });

    const main = page.getByRole('main');
    const morningTab = main.getByRole('tab', { name: 'Morning' });
    await morningTab.click();
    await expect(morningTab).toHaveAttribute('aria-selected', 'true');
    await main.getByRole('tab', { name: 'All Shifts' }).click();

    await main.getByRole('button', { name: 'Table View' }).click();
    expect(await main.locator('tbody tr').count()).toBeGreaterThan(0);
    await main.getByRole('button', { name: 'Floor Plan' }).click();

    await main.getByRole('combobox', { name: /Filter seats by status/i }).selectOption('free');
    await main.getByRole('combobox', { name: /Filter seats by status/i }).selectOption('all');

    await main.getByRole('button', { name: /Bulk Generate Seats/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
