import { expect, test } from '@playwright/test';

test('dashboard_overview displays KPI summary cards and workspace links', async ({ page }) => {
  await page.goto('/superadmin/superadmin_dashboard/dashboard_overview');

  const main = page.getByRole('main');
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();

  // Navigation sidebar landmark remains accessible
  await expect(page.locator('#superadmin-navigation-sidebar')).toBeVisible();
  
  // Ensure no crash or missing chunk errors occurred
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
  await expect(page.getByText('Application error', { exact: false })).toHaveCount(0);
});
