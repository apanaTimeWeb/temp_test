import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../../frontend_admin/package.json', import.meta.url));
const { expect, test } = require('@playwright/test');

test('loads the canonical settings_branches submodule route', async ({ page }) => {
  await page.goto('/admin/admin_settings/settings_branches');
  await expect(page).toHaveURL(new RegExp('\\/admin\\/admin_settings\\/settings_branches(?:[?#]|$)'));
  await expect(page.getByRole('heading').first()).toBeVisible();
});

test('demo branch creation validates and adds a user-entered branch to the list', async ({ page }) => {
  test.skip(process.env.PLAYWRIGHT_APP_MODE !== 'demo', 'Requires PLAYWRIGHT_APP_MODE=demo and a server built with NEXT_PUBLIC_FRONTEND_DEMO_MODE=true.');
  await page.goto('/admin/admin_settings/settings_branches?view=create');
  await page.getByLabel('Branch name').fill('Demo Test Branch');
  await page.getByLabel('Branch code').fill('DEMO-TST');
  await page.getByLabel('Address').fill('10 Test Road');
  await page.getByLabel('Contact phone').fill('+91 9876543210');
  await page.getByLabel('Contact email').fill('demo-test@example.invalid');
  await page.getByRole('button', { name: 'Add branch to demo' }).click();
  await expect(page.getByText('Demo Test Branch')).toBeVisible();
  await expect(page).toHaveURL(/view=all/);
});
