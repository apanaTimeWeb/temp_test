import { expect, test } from '@playwright/test';
);

test('redirects the admin dashboard root to the canonical overview leaf', async ({ page }) => {
  await page.goto('/admin/admin_dashboard');

  await expect(page).toHaveURL(
    /\/admin\/admin_dashboard\/dashboard_overview(?:[?#]|$)/,
  );
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('shows links for the target admin workspaces', async ({ page }) => {
  await page.goto('/admin/admin_dashboard/dashboard_overview');

  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(main.locator('a[href="/admin/admin_members/members_directory"]')).toHaveCount(1);
  await expect(main.locator('a[href="/admin/admin_seats_shifts_lockers/seats_matrix"]')).toHaveCount(1);
  await expect(main.locator('a[href="/admin/admin_finance/finance_dashboard"]')).toHaveCount(1);
});
