import { expect, test } from '@playwright/test';

test('loads the admin dashboard root overview cleanly via rewrite', async ({ page }) => {
  await page.goto('/admin/admin_dashboard');

  await expect(page).toHaveURL(
    /\/admin\/admin_dashboard(?:\/dashboard_overview)?(?:[?#]|$)/,
  );
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('shows the overview workspace cleanly', async ({ page }) => {
  await page.goto('/admin/admin_dashboard/dashboard_overview');

  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { level: 1 })).toBeVisible();
});
