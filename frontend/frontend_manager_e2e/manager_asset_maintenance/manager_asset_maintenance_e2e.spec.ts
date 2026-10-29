import { expect, test } from '@playwright/test';

test.describe('manager asset maintenance', () => {
  test('canonical route preserves sample-only maintenance register and status filter', async ({ page }) => {
    await page.goto('/frontend_manager/manager_accounts_assets/assets_maintenance');
    await expect(page.getByRole('heading', { name: 'Asset Maintenance' })).toBeVisible();
    await expect(page.getByTestId('manager-accounting-maintenance-contract-warning')).toBeVisible();
    await page.getByRole('combobox').selectOption('pending');
    await expect(page.getByText('CCTV Camera — B2')).toBeVisible();
    await expect(page.getByText('Water Purifier')).toHaveCount(0);
  });

  test('legacy view query remains pinned to maintenance rather than a sibling workflow', async ({ page }) => {
    await page.goto('/frontend_manager/manager_accounts_assets/assets_maintenance?view=expenses');
    await expect(page.getByRole('heading', { name: 'Asset Maintenance' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Expenses' })).toHaveCount(0);
  });
});
