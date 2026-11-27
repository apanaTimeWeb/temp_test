import { expect, test } from '@playwright/test';

test('redirects admin_finance to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_finance');
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_payments(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

for (const route of [
  '/admin/admin_finance/finance_payments',
  '/admin/admin_finance/finance_refunds',
  '/admin/admin_finance/finance_referrals',
  '/admin/admin_finance/finance_auto_suspend',
  '/admin/admin_finance/finance_security_deposits',
]) {
  test(`direct route loads ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
}
