import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_accounts_assets domain E2E', () => {
  test('accounts_daily_settlement filters by shift and searches cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_accounts_assets/accounts_daily_settlement',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const shiftFilter = page.getByLabel('Filter by Shift');
    if ((await shiftFilter.count()) > 0 && (await shiftFilter.isVisible())) {
      await shiftFilter.selectOption({ index: 1 });
      await shiftFilter.selectOption({ index: 0 });
    }
  });

  test('accounts_seat_gap_report filters by condition status and floor cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_accounts_assets/accounts_seat_gap_report',
      { checkSearchInput: true },
    );

    await expect(page.getByLabel('Filter by condition status')).toBeVisible();
    await expect(page.getByLabel('Filter by floor')).toBeVisible();
  });

  test('assets_maintenance filters by priority and maintenance type', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_accounts_assets/assets_maintenance',
      { checkSearchInput: true },
    );

    await expect(page.getByLabel('Filter by priority')).toBeVisible();
    await expect(page.getByLabel('Filter by maintenance type')).toBeVisible();
  });

  for (const route of [
    '/frontend_manager/manager_accounts_assets/accounts_expenses',
    '/frontend_manager/manager_accounts_assets/assets_register',
  ]) {
    test(`loads ${route} cleanly`, async ({ page }) => {
      await expectCanonicalManagerSubmoduleLoaded(page, route, { checkSearchInput: true });
    });
  }
});
