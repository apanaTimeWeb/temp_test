import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_communication domain E2E', () => {
  test('communication_whatsapp_logs filters log rows by dispatch mode and restores on Clear', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_communication/communication_whatsapp_logs',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(7);

    const channelSelect = page.getByLabel('Filter by Channel / Dispatch Mode');
    await channelSelect.selectOption('WhatsApp Web (Free)');
    await expect(main.getByText('Rahul Sharma')).toHaveCount(0);
    await expect(main.getByText('Priya Verma')).toBeVisible();

    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await expect(channelSelect).toHaveValue('All');
    await expect(rows).toHaveCount(7);
    await expect(main.getByText('Rahul Sharma')).toBeVisible();
  });

  test('communication_complaints filters by category, switches status tabs, and resets cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_communication/communication_complaints',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(4);

    const categorySelect = page.getByLabel('Filter by Category');
    await categorySelect.selectOption('WiFi');
    await expect(rows).toHaveCount(1);
    await expect(main.getByText('AC Water Leakage')).toHaveCount(0);
    await expect(main.getByText('Wi-Fi Signal Drop')).toBeVisible();

    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(categorySelect).toHaveValue('all');
    await expect(rows).toHaveCount(4);

    await page.getByRole('button', { name: /^Open\b/i }).click();
    await expect(rows).toHaveCount(2);
    await page.getByRole('button', { name: /^All\b/i }).click();
    await expect(rows).toHaveCount(4);
  });

  test('communication_notification_center switches all 3 tabs and opens noticeboard flyer modal', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_communication/communication_notification_center',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const broadcastTab = page.getByRole('button', { name: /Member Notifications|Compose/i });
    const historyTab = page.getByRole('button', { name: /Notification History|Logs/i });
    const myNotifTab = page.getByRole('button', { name: /My Notifications/i });

    await broadcastTab.click();
    await expect(page.getByLabel('Select notification recipient')).toBeVisible();

    await historyTab.click();
    await expect(page.locator('table').first()).toBeVisible();

    await myNotifTab.click();
    await expect(myNotifTab).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: /Print Noticeboard Flyer/i }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /Close/i }).first().click();
    await expect(dialog).toBeHidden();
  });

  test('communication_whatsapp_templates renders live variable preview and saves template', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_communication/communication_whatsapp_templates',
      { checkNoHorizontalOverflow: true },
    );

    await expect(page.getByText('Rahul Sharma').first()).toBeVisible();
    await page.getByRole('button', { name: /Save Template/i }).first().click();
    await expect(page.getByText(/saved successfully/i).first()).toBeVisible();
  });
});
