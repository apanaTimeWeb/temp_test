import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test('loads the canonical dashboard reports route', async ({ page }) => {
  await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_dashboard/dashboard_reports');
  await expect(page.getByRole('heading', { level: 1, name: /reports and analytics/i })).toBeVisible();
  await expect(page.getByRole('tablist', { name: /report date range/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /export csv/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /print \/ save pdf/i })).toBeVisible();
});

test('switches report date range tabs, filters branch, and exports CSV', async ({ page }) => {
  await page.goto('/admin/admin_dashboard/dashboard_reports');
  const thisMonthTab = page.getByRole('tab', { name: /this month/i });
  await thisMonthTab.click();
  await expect(thisMonthTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: /branch summary/i })).toBeVisible();

  const branchFilter = page.getByRole('combobox', { name: /filter by branch/i });
  await expect(branchFilter).toBeVisible();
  await branchFilter.selectOption({ index: 1 });
  await expect(page.locator('main tbody tr')).toHaveCount(1);

  await branchFilter.selectOption('All Branches');
  await expect(page.locator('main tbody tr')).toHaveCount(4);

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /export csv/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('admin-reports-demo-snapshot.csv');
});
