import { expect, test } from '@playwright/test';
import { expectCanonicalAdminSubmoduleLoaded } from '../../helpers/adminSubmoduleRouteCheck';

test('canonical enquiries route consumes detail-view query and toggles views/filters cleanly', async ({ page }) => {
  await page.goto('/admin/admin_members/members_enquiries?view=enquiries%2Fdetail&id=lead-7');
  await expect(page).toHaveURL(/\/admin\/admin_members\/members_enquiries\?view=enquiries%2Fdetail&id=lead-7/);
  await expect(page.getByRole('heading').first()).toBeVisible();

  await expectCanonicalAdminSubmoduleLoaded(page, '/admin/admin_members/members_enquiries', { checkSearchInput: true });

  await page.getByTestId('admin_enquiries-AdminEnquiriesPageView-control-001').click();
  await expect(page.getByTestId('admin_enquiries-AdminEnquiriesPageView-control-001')).toHaveAttribute('aria-pressed', 'true');

  await page.getByTestId('admin_enquiries-AdminEnquiriesPageView-control-002').click();
  await expect(page.getByTestId('admin_enquiries-AdminEnquiriesPageView-control-002')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('main tbody tr')).toHaveCount(4);

  const statusSelect = page.getByTestId('admin_enquiries-AdminEnquiriesPageView-control-009');
  await statusSelect.selectOption('New');
  const filteredRows = await page.locator('main tbody tr').count();
  expect(filteredRows).toBeLessThanOrEqual(4);
  await statusSelect.selectOption('All');
  await expect(page.locator('main tbody tr')).toHaveCount(4);
});
