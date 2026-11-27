import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test('demo support ticket validation produces a local ticket confirmation and switches tabs cleanly', async ({ page }) => {
  test.skip(process.env.PLAYWRIGHT_APP_MODE === 'live', 'Skipped in strict live-only mode; runs by default when NEXT_PUBLIC_FRONTEND_DEMO_MODE=true.');
  await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_settings/settings_support', { checkSearchInput: true });

  await page.getByTestId('admin_support-AdminSettingsSupportMain-navigation-announcements').click();
  await page.getByTestId('admin_support-AdminSettingsSupportMain-navigation-tickets').click();

  await page.getByRole('button', { name: /Create Ticket/i }).click();
  await page.getByLabel(/Subject/i).fill('Demo QA ticket');
  await page.getByLabel(/Description/i).fill('This ticket is used to verify local demo creation.');
  await page.getByRole('button', { name: /Create ticket in demo/i }).click();
  await expect(page.getByRole('heading', { name: /Demo ticket created/i })).toBeVisible();
  await expect(page.getByRole('region', { name: /Demo ticket created/i }).getByRole('status')).toContainText(/SUP-DEMO-/);
  await expect(page.getByRole('region', { name: /Demo ticket created/i }).getByRole('status')).toContainText(/local demo page only/i);
});
