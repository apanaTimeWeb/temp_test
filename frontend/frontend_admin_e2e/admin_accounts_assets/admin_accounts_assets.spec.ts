import { expect, test } from '@playwright/test';

test('redirects admin_accounts_assets to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_accounts_assets');
  await expect(page).toHaveURL(/\/admin\/admin_accounts_assets\/accounts_expenses(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

for (const route of [
  '/admin/admin_accounts_assets/accounts_daily_settlement',
  '/admin/admin_accounts_assets/accounts_expenses',
  '/admin/admin_accounts_assets/accounts_financial_reports',
  '/admin/admin_accounts_assets/accounts_seat_gap_report',
  '/admin/admin_accounts_assets/assets_register',
]) {
  test(`direct route loads ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
}
