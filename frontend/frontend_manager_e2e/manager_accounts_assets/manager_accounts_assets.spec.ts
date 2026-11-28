import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_accounts_assets domain E2E', () => {
  test('accounts_daily_settlement filters shift rows and opens denomination & handover modal', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_accounts_assets/accounts_daily_settlement',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(3);

    const shiftFilter = page.getByLabel('Filter by Shift');
    await shiftFilter.selectOption('Morning');
    await expect(rows).toHaveCount(1);
    await expect(main.getByText('Night (9PM–6AM)')).toHaveCount(0);

    await shiftFilter.selectOption('all');
    await expect(rows).toHaveCount(3);

    const denomBtn = page.getByRole('button', { name: /Denomination & Owner Handover/i }).first();
    await denomBtn.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /Close|Cancel/i }).first().click();
    await expect(dialog).toBeHidden();
  });

  test('accounts_expenses filters ledger rows to empty state and restores full ledger on reset', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_accounts_assets/accounts_expenses',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(6);
    await expect(main.getByText('Electricity').first()).toBeVisible();

    const searchInput = main.locator('input[placeholder*="Search" i]').first();
    await searchInput.fill('__NO_MATCH_EXPENSE__');
    await expect(rows).toHaveCount(0);

    await page.getByRole('button', { name: /Cash \(Counter\)/i }).click();
    await page.getByRole('button', { name: /Reset Filters/i }).click();
    await expect(searchInput).toHaveValue('');
    await expect(rows).toHaveCount(6);
    await expect(main.getByText('Electricity').first()).toBeVisible();
  });

  test('accounts_seat_gap_report filters rows by condition status & floor and resets cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_accounts_assets/accounts_seat_gap_report',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(6);

    const conditionFilter = page.getByLabel('Filter by condition status');
    const floorFilter = page.getByLabel('Filter by floor');
    await conditionFilter.selectOption('maintenance');
    await expect(main.getByText('A-04')).toHaveCount(0);
    await expect(main.getByText('C-07')).toBeVisible();

    await floorFilter.selectOption('First');
    await page.getByRole('button', { name: /Reset Filters/i }).click();
    await expect(conditionFilter).toHaveValue('all');
    await expect(floorFilter).toHaveValue('all');
    await expect(rows).toHaveCount(6);
  });

  test('assets_register filters assets by category and restores all registered assets cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_accounts_assets/assets_register',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(6);

    const categoryFilter = page.getByLabel('Filter by category');
    await categoryFilter.selectOption('Security');
    await expect(main.getByText('AC Unit — Hall A')).toHaveCount(0);
    await expect(main.getByText('CCTV Camera Set (8)')).toBeVisible();

    await categoryFilter.selectOption('all');
    await expect(rows).toHaveCount(6);
    await expect(main.getByText('AC Unit — Hall A')).toBeVisible();
  });

  test('assets_maintenance filters tickets by priority and resets back to full list', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_accounts_assets/assets_maintenance',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(5);

    const priorityFilter = page.getByLabel('Filter by priority');
    await priorityFilter.selectOption('emergency');
    await expect(main.getByText('Water Purifier')).toHaveCount(0);
    await expect(main.getByText('CCTV Camera — B2')).toBeVisible();

    await page.getByRole('button', { name: /Reset Filters/i }).click();
    await expect(priorityFilter).toHaveValue('all');
    await expect(rows).toHaveCount(5);
    await expect(main.getByText('Water Purifier')).toBeVisible();
  });
});
