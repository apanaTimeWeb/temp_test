import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test('loads the admin dashboard root overview cleanly via rewrite', async ({ page }) => {
  await page.goto('/admin/admin_dashboard');
  await expect(page).toHaveURL(/\/admin\/admin_dashboard(?:\/dashboard_overview)?(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/Library overview/i);
});

test('shows overview leaderboard and switches date-range filters interactively', async ({ page }) => {
  await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_dashboard/dashboard_overview');

  const main = page.getByRole('main');
  await expect(main.locator('tbody tr')).toHaveCount(4);

  await main.getByRole('button', { name: 'Today', exact: true }).click();
  await main.getByRole('button', { name: 'This Week', exact: true }).click();
  await main.getByRole('button', { name: 'This Month', exact: true }).click();
  await expect(main.locator('tbody tr')).toHaveCount(4);
});
