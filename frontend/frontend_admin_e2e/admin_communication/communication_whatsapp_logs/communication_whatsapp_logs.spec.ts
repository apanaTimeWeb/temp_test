import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('communication_whatsapp_logs E2E', () => {
  test('filters WhatsApp Dispatch Logs by status tabs and dropdown filters', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_communication/communication_whatsapp_logs', { checkSearchInput: true });

    const main = page.getByRole('main');
    await expect(main.locator('tbody tr')).toHaveCount(7);

    await page.getByTestId('admin_communication-status-filter-delivered').click();
    await expect(main.locator('tbody tr')).toHaveCount(4);

    await page.getByTestId('admin_communication-status-filter-failed').click();
    await expect(main.locator('tbody tr')).toHaveCount(1);

    await page.getByTestId('admin_communication-status-filter-all').click();
    await expect(main.locator('tbody tr')).toHaveCount(7);

    await page.getByTestId('admin_communication-page-control-009').selectOption('welcome');
    expect(await main.locator('tbody tr').count()).toBeLessThanOrEqual(7);
    await page.getByTestId('admin_communication-page-control-009').selectOption('All');
    await expect(main.locator('tbody tr')).toHaveCount(7);
  });
});
