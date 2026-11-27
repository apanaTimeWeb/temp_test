import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test.describe('communication_notification_center E2E', () => {
  test('filters notifications across category pills and marks all read cleanly', async ({ page }) => {
    await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_communication/communication_notification_center', { checkSearchInput: true });

    await expect(page.getByRole('heading', { level: 1 })).toContainText(/5 Unread/i);

    await page.getByTestId('admin_communication-notification-filter-finance').click();
    await page.getByTestId('admin_communication-notification-filter-crm').click();
    await page.getByTestId('admin_communication-notification-filter-operations').click();
    await page.getByTestId('admin_communication-notification-filter-high-only').click();
    await page.getByTestId('admin_communication-notification-filter-all').click();

    const markAllBtn = page.getByTestId('admin_communication-page-control-001');
    await expect(markAllBtn).toBeEnabled();
    await markAllBtn.click();
    await expect(markAllBtn).toBeDisabled();
    await expect(page.getByRole('heading', { level: 1 })).not.toContainText(/Unread/i);
  });
});
