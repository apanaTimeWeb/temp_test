import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_seats_shifts_lockers domain E2E', () => {
  test('seats_matrix toggles grid/table views, filters rows by status, and previews mutual/direct seat swap', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_seats_shifts_lockers/seats_matrix',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(main.getByText('Test Student A')).toBeVisible();
    await expect(rows).toHaveCount(4);

    await page.getByRole('button', { name: /Grid/i }).click();
    await expect(page.getByRole('button', { name: /Grid/i })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: /Table/i }).click();
    await expect(page.getByRole('button', { name: /Table/i })).toHaveAttribute('aria-pressed', 'true');

    const statusFilter = page.getByLabel('Filter seats by status');
    await statusFilter.selectOption('free');
    await expect(rows).toHaveCount(1);
    await expect(main.getByText('Test Student A')).toHaveCount(0);
    await statusFilter.selectOption('all');
    await expect(rows).toHaveCount(4);
    await expect(main.getByText('Test Student A')).toBeVisible();

    await expect(page.getByTestId('manager-seats-zone-filter')).toBeVisible();

    await page.getByTestId('manager-seat-matrix-swap-btn').click();
    const swapDialog = page.getByRole('dialog');
    await expect(swapDialog).toBeVisible();
    const confirmBtn = swapDialog.getByTestId('manager-confirm-seat-swap-btn');
    await expect(confirmBtn).toBeDisabled();
    await swapDialog.getByTestId('manager-swap-target-seat-select').selectOption({ index: 1 });
    await expect(swapDialog.getByText(/Mode:/i)).toBeVisible();
    await expect(confirmBtn).toBeEnabled();
    await swapDialog.getByRole('button', { name: /Cancel|Close/i }).first().click();
    await expect(swapDialog).toBeHidden();
  });

  test('seats_history filters history rows by shift and interacts with seat incident audit dialog', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_seats_shifts_lockers/seats_history',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(2);
    await expect(main.getByText('Test Student A')).toBeVisible();
    await expect(main.getByText('Test Student B')).toBeVisible();

    await page.getByLabel('Filter by Shift').selectOption('Morning');
    await expect(rows).toHaveCount(1);
    await expect(main.getByText('Test Student B')).toHaveCount(0);

    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(rows).toHaveCount(2);
    await expect(main.getByText('Test Student B')).toBeVisible();

    const auditBtn = page.getByTestId('manager-seat-history-audit-modal-btn');
    await auditBtn.click();
    const auditDialog = page.getByRole('dialog');
    await expect(auditDialog).toBeVisible();
    const seatSelect = auditDialog.getByTestId('manager-audit-seat-select');
    await expect(seatSelect).toBeVisible();
    await seatSelect.selectOption({ index: 1 });
    await auditDialog.getByRole('button', { name: /Close|Cancel/i }).first().click();
    await expect(auditDialog).toBeHidden();
  });

  test('lockers_management filters expired lockers, switches grid/table view, and resets status cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_seats_shifts_lockers/lockers_management',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    await page.getByRole('button', { name: 'Table View', exact: true }).click();
    const tableRows = page.getByTestId('manager-main-content').locator('tbody tr');
    const allCount = await tableRows.count();
    expect(allCount).toBe(18);

    const expiredBtn = page.getByTestId('manager-filter-expired-lockers-btn');
    await expect(expiredBtn).toBeVisible();
    await expiredBtn.click();
    await expect(expiredBtn).toBeHidden();
    await expect(tableRows).toHaveCount(2);

    await page.getByRole('button', { name: /All Statuses/i }).click();
    await expect(expiredBtn).toBeVisible();
    await expect(tableRows).toHaveCount(18);
  });
});
