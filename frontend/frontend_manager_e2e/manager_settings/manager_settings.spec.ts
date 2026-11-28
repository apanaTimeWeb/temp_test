import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_settings domain E2E', () => {
  test('settings_branch_info opens Wi-Fi Standee QR dialog, renders QR SVG, toggles password, and closes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_settings/settings_branch_info',
      { checkNoHorizontalOverflow: true },
    );

    await page.getByRole('button', { name: /Wi-Fi Standee QR/i }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Student Wi-Fi Connect QR Code')).toBeVisible();
    await expect(dialog.locator('svg').first()).toBeVisible();
    await dialog.getByRole('button', { name: 'Show password' }).click();
    await expect(dialog.getByRole('button', { name: 'Hide password' })).toBeVisible();
    await dialog.getByRole('button', { name: /Close|Cancel/i }).first().click();
    await expect(dialog).toBeHidden();
  });

  test('settings_help_support filters tickets, switches tabs, and guards unsaved ticket draft', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_settings/settings_help_support',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(2);

    const statusSelect = page.getByLabel('Filter by Status');
    await statusSelect.selectOption('Open');
    await expect(rows).toHaveCount(1);
    await expect(main.getByText('TCK-002')).toHaveCount(0);
    await expect(main.getByText('TCK-001')).toBeVisible();

    await statusSelect.selectOption('all');
    await expect(rows).toHaveCount(2);

    await page.getByRole('button', { name: /Announcements/i }).click();
    await page.getByRole('button', { name: /Support Tickets/i }).first().click();

    const createTicketBtn = page.getByRole('button', { name: 'Create New Ticket', exact: true });
    await createTicketBtn.click();
    const subjectInput = page.locator('#manager-ticket-subject');
    await expect(subjectInput).toBeVisible();
    await subjectInput.fill('Playwright Draft Ticket');
    await page.getByRole('button', { name: /Cancel/i }).first().click();
    await expect(page.getByRole('alertdialog')).toBeVisible();
    await page.getByTestId('manager-help-support-unsaved-confirm-cancel').click();
    await expect(subjectInput).toHaveValue('Playwright Draft Ticket');
    await page.getByRole('button', { name: /Cancel/i }).first().click();
    await page.getByTestId('manager-help-support-unsaved-confirm-continue').click();
    await expect(subjectInput).toBeHidden();
  });

  test('settings_security switches all 4 Security tabs and verifies each panel renders', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_settings/settings_security',
      { checkNoHorizontalOverflow: true },
    );

    const tabsNav = page.getByRole('navigation', { name: 'Security Tabs' });
    await tabsNav.getByRole('button', { name: /Two-Factor \(2FA\)/i }).click();
    await expect(page.getByRole('heading', { name: /Two-Factor Authentication/i })).toBeVisible();

    await tabsNav.getByRole('button', { name: /Active Sessions/i }).click();
    await expect(page.getByRole('button', { name: /Terminate Other Sessions|Log Out All/i }).first()).toBeVisible();

    await tabsNav.getByRole('button', { name: /Login Activity/i }).click();
    await expect(page.locator('table, [data-testid]').first()).toBeVisible();

    await tabsNav.getByRole('button', { name: /Password/i }).click();
    await expect(page.getByRole('heading', { name: /Change Password/i })).toBeVisible();
  });
});
