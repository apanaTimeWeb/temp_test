import { expect, test } from '@playwright/test';

test('redirects admin_members to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_members');
  await expect(page).toHaveURL(/\/admin\/admin_members\/members_directory(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

for (const route of [
  '/admin/admin_members/members_directory',
  '/admin/admin_members/members_enquiries',
  '/admin/admin_members/members_plans',
  '/admin/admin_members/members_coupons',
  '/admin/admin_members/members_blacklist',
]) {
  test(`direct route loads ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
}
