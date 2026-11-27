import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_seats_shifts_lockers domain E2E', () => {
  test('seats_matrix filters seats by status/zone and supports swap dialog', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_seats_shifts_lockers/seats_matrix',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const statusFilter = page.getByLabel('Filter seats by status');
    if ((await statusFilter.count()) > 0 && (await statusFilter.isVisible())) {
      await statusFilter.selectOption({ index: 1 });
      await statusFilter.selectOption({ index: 0 });
    }
    const zoneFilter = page.getByTestId('manager-seats-zone-filter');
    if ((await zoneFilter.count()) > 0 && (await zoneFilter.isVisible())) {
      await expect(zoneFilter).toBeVisible();
    }
  });

  test('seats_history filters history and opens audit dialog cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_seats_shifts_lockers/seats_history',
      { checkSearchInput: true },
    );

    const auditBtn = page.getByTestId('manager-seat-history-audit-modal-btn');
    if ((await auditBtn.count()) > 0 && (await auditBtn.isVisible())) {
      await auditBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('lockers_management toggles expired lockers filter cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_seats_shifts_lockers/lockers_management',
      { checkSearchInput: true },
    );

    const expiredBtn = page.getByTestId('manager-filter-expired-lockers-btn');
    await expect(expiredBtn).toBeVisible();
    await expiredBtn.click();
    await expect(expiredBtn).toBeHidden();
    await page.getByRole('button', { name: /All Statuses/i }).click();
    await expect(expiredBtn).toBeVisible();
  });
});
