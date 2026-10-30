import { expect, test } from '@playwright/test';
test('canonical enquiries route consumes its documented detail-view query without redirecting to a retired URL', async ({ page }) => {
  await page.goto('/admin/admin_members/members_enquiries?view=enquiries%2Fdetail&id=lead-7');
  await expect(page).toHaveURL(/\/admin\/admin_members\/members_enquiries\?view=enquiries%2Fdetail&id=lead-7/);
  await expect(page.getByRole('heading').first()).toBeVisible();
});
