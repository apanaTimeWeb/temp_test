import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_settings domain E2E', () => {
  test('settings_branch_info renders branch setup and responsive view cleanly', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_settings/settings_branch_info',
      { checkNoHorizontalOverflow: true },
    );
  });

  test('settings_help_support filters tickets and guards ticket drawer', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_settings/settings_help_support',
      { checkSearchInput: true },
    );

    await expect(page.getByLabel('Filter by Category')).toBeVisible();
    await expect(page.getByLabel('Filter by Status')).toBeVisible();
    await expect(page.getByLabel('Filter by Priority')).toBeVisible();

    const createTicketBtn = page.getByRole('button', { name: 'Create New Ticket', exact: true });
    await expect(createTicketBtn).toBeVisible();
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

  test('settings_security switches all 4 Security tabs cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_settings/settings_security',
      { checkNoHorizontalOverflow: true },
    );

    const tabsNav = page.getByRole('navigation', { name: 'Security Tabs' });
    await tabsNav.getByRole('button', { name: /Two-Factor \(2FA\)/i }).click();
    await tabsNav.getByRole('button', { name: /Active Sessions/i }).click();
    await tabsNav.getByRole('button', { name: /Login Activity/i }).click();
    await tabsNav.getByRole('button', { name: /Password/i }).click();
  });
});
