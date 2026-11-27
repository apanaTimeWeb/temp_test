import { expect, test } from '@playwright/test';

test('redirects superadmin_security to its canonical default submodule', async ({ page }) => {
  await page.goto('/superadmin/superadmin_security');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_security(?:\/security_overview)?(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
});

test('direct route loads security_overview', async ({ page }) => {
  await page.goto('/superadmin/superadmin_security/security_overview');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_security\/security_overview(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads security_threats', async ({ page }) => {
  await page.goto('/superadmin/superadmin_security/security_threats');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_security\/security_threats(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads security_active_sessions', async ({ page }) => {
  await page.goto('/superadmin/superadmin_security/security_active_sessions');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_security\/security_active_sessions(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads security_ip_firewall', async ({ page }) => {
  await page.goto('/superadmin/superadmin_security/security_ip_firewall');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_security\/security_ip_firewall(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads security_login_security', async ({ page }) => {
  await page.goto('/superadmin/superadmin_security/security_login_security');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_security\/security_login_security(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads security_mfa', async ({ page }) => {
  await page.goto('/superadmin/superadmin_security/security_mfa');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_security\/security_mfa(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads security_password_policy', async ({ page }) => {
  await page.goto('/superadmin/superadmin_security/security_password_policy');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_security\/security_password_policy(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});

test('direct route loads security_audit_logs', async ({ page }) => {
  await page.goto('/superadmin/superadmin_security/security_audit_logs');
  await expect(page).toHaveURL(/\/superadmin\/superadmin_security\/security_audit_logs(?:[?#]|$)/);
  await expect(page.locator('h1, h2, h3, main, [role="status"]').first()).toBeVisible();
  await expect(page.getByText('This page could not be found', { exact: false })).toHaveCount(0);
});
