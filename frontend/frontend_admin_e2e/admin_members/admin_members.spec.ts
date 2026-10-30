import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../frontend_admin/package.json', import.meta.url));
const { expect, test } = require('@playwright/test');

test('redirects admin_members to its canonical default submodule', async ({ page }) => {
  await page.goto('/admin/admin_members');
  await expect(page).toHaveURL(/\/admin\/admin_members\/members_directory(?:[?#]|$)/);
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
});

test('direct route loads members_directory', async ({ page }) => {
  await page.goto('/admin/admin_members/members_directory');
  await expect(page).toHaveURL(/\/admin\/admin_members\/members_directory(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads members_students', async ({ page }) => {
  await page.goto('/admin/admin_members/members_students');
  await expect(page).toHaveURL(/\/admin\/admin_members\/members_students(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads members_enquiries', async ({ page }) => {
  await page.goto('/admin/admin_members/members_enquiries');
  await expect(page).toHaveURL(/\/admin\/admin_members\/members_enquiries(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads members_blacklist', async ({ page }) => {
  await page.goto('/admin/admin_members/members_blacklist');
  await expect(page).toHaveURL(/\/admin\/admin_members\/members_blacklist(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads members_plans', async ({ page }) => {
  await page.goto('/admin/admin_members/members_plans');
  await expect(page).toHaveURL(/\/admin\/admin_members\/members_plans(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('direct route loads members_coupons', async ({ page }) => {
  await page.goto('/admin/admin_members/members_coupons');
  await expect(page).toHaveURL(/\/admin\/admin_members\/members_coupons(?:[?#]|$)/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});
