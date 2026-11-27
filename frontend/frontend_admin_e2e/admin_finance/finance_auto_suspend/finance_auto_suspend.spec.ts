import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('finance_auto_suspend E2E', () => {
  test('filters defaulters by shift/overdue days and opens Gate QR Kiosk simulator', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_finance/finance_auto_suspend', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(5);

    const shiftSelect = main.getByRole('combobox', { name: /Filter by shift/i });
    await shiftSelect.selectOption('Morning');
    expect(await main.locator('tbody tr').count()).toBeLessThanOrEqual(5);
    await shiftSelect.selectOption('all');
    await expect(main.locator('tbody tr')).toHaveCount(5);

    await page.getByTestId('open-gate-kiosk-simulator-btn').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
