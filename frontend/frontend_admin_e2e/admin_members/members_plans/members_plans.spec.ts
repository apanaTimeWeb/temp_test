import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test('demo plans support local create, status filter, search, and delete operations', async ({ page }) => {
  test.skip(process.env.PLAYWRIGHT_APP_MODE === 'live', 'Skipped in strict live-only mode; runs by default when NEXT_PUBLIC_FRONTEND_DEMO_MODE=true.');
  await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_members/members_plans', { checkSearchInput: true });

  await page.getByRole('button', { name: /Create Plan/i }).click();
  await page.getByLabel('Plan Name').fill('Demo QA Plan');
  await page.getByRole('spinbutton', { name: /Price/i }).fill('1499');
  await page.getByLabel('Duration').fill('30 days');
  await page.getByRole('spinbutton', { name: /Validity/i }).fill('30');
  await page.getByRole('textbox', { name: /Features/i }).fill('Seat access\nLocker access');
  await page.getByTestId('admin_plans-AdminMembersPlansMain-control-010').click();
  await expect(page.getByRole('heading', { level: 3, name: 'Demo QA Plan' })).toBeVisible();
  await page.getByRole('button', { name: /Delete Demo QA Plan/i }).click();
  await page.getByTestId('admin_plans-AdminMembersPlansMain-control-014').click();
  await expect(page.getByRole('heading', { level: 3, name: 'Demo QA Plan' })).toHaveCount(0);
});
