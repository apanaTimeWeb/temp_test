import { expect, test } from '@playwright/test';

test('superadmin shell exposes navigation landmark and brand identity', async ({ page }) => {
  await page.goto('/superadmin/superadmin_dashboard/dashboard_overview');
  
  // Landmark check: sidebar aside and primary navigation
  const sidebar = page.locator('#superadmin-navigation-sidebar');
  await expect(sidebar).toBeVisible();

  const nav = page.locator('#superadmin-primary-navigation');
  await expect(nav).toBeVisible();

  // Brand identity: Library OS logo and Super Admin badge
  await expect(sidebar.locator('span:text-is("Library")').first()).toBeVisible();
  await expect(sidebar.locator('span:text-is("OS")').first()).toBeVisible();
  await expect(sidebar.getByText('Super Admin', { exact: true }).first()).toBeVisible();
});

test('superadmin sidebar contains links to core modules', async ({ page }) => {
  await page.goto('/superadmin/superadmin_dashboard/dashboard_overview');

  const nav = page.locator('#superadmin-primary-navigation');
  await expect(nav.locator('a[href*="/superadmin/superadmin_dashboard/dashboard_overview"]').first()).toBeVisible();
  await expect(nav.locator('a[href*="/superadmin/superadmin_libraries/libraries_overview"]').first()).toBeVisible();
  await expect(nav.locator('a[href*="/superadmin/superadmin_branches/branches_overview"]').first()).toBeVisible();
  await expect(nav.locator('a[href*="/superadmin/superadmin_users/users_directory"]').first()).toBeVisible();
  await expect(nav.locator('a[href*="/superadmin/superadmin_plans/plans_pricing_catalog"]').first()).toBeVisible();
  await expect(nav.locator('a[href*="/superadmin/superadmin_billing/billing_invoices"]').first()).toBeVisible();
  await expect(nav.locator('a[href*="/superadmin/superadmin_security/security_overview"]').first()).toBeVisible();
  await expect(nav.locator('a[href*="/superadmin/superadmin_data/data_overview"]').first()).toBeVisible();
  await expect(nav.locator('a[href*="/superadmin/superadmin_system/system_health_overview"]').first()).toBeVisible();
});

test('superadmin root route serves default dashboard overview', async ({ page }) => {
  await page.goto('/superadmin');
  await expect(page).toHaveURL(/\/superadmin(?:\/superadmin_dashboard)?(?:\/dashboard_overview)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});
