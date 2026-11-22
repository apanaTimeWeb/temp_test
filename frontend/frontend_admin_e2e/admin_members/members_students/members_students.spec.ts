import { expect, test } from '@playwright/test';
test('loads the canonical members_students submodule route', async ({ page }) => {
  await page.goto('/admin/admin_members/members_students');
  await expect(page).toHaveURL(new RegExp('\\/admin\\/admin_members\\/members_students(?:[?#]|$)'));
  await expect(page.getByRole('heading').first()).toBeVisible();
});


test('members_students is directly addressable under its canonical domain without a duplicate primary menu item', async ({ page }) => {
  await page.goto('/admin/admin_members/members_students');
  await expect(page).toHaveURL(new RegExp('\\/admin\\/admin_members\\/members_students(?:[?#]|$)'));
  await expect(page.getByRole('heading').first()).toBeVisible();
  await page.goto('/admin/admin_members');
  const navigation = page.getByRole('navigation', { name: /admin navigation/i });
  if (await navigation.count()) await expect(navigation.getByRole('link', { name: /^Students$/i })).toHaveCount(0);
});
