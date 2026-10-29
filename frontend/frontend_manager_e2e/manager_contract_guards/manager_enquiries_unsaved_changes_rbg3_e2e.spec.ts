import { expect, test } from '@playwright/test';

test.describe('Manager Enquiries unsaved-draft navigation', () => {
  test('canceling the accessible confirmation preserves the dirty draft', async ({ page }) => {
    await page.goto('/frontend_manager/manager_members/members_enquiries?view=add');
    const name = page.getByLabel('Full Name');
    await name.fill('Unsaved Draft Example');
    await page.getByRole('button', { name: /close drawer/i }).click();
    const confirmation = page.getByRole('alertdialog');
    await expect(confirmation).toBeVisible();
    await page.getByTestId('managermembersenquiries-unsaved-confirm-cancel').click();
    await expect(name).toHaveValue('Unsaved Draft Example');
    await expect(page).toHaveURL(/manager_enquiries\?view=add/);
  });

  test('accepting the accessible confirmation navigates to the enquiry list', async ({ page }) => {
    await page.goto('/frontend_manager/manager_members/members_enquiries?view=add');
    await page.getByLabel('Full Name').fill('Draft To Discard');
    await page.getByRole('button', { name: /close drawer/i }).click();
    await expect(page.getByRole('alertdialog')).toBeVisible();
    await page.getByTestId('managermembersenquiries-unsaved-confirm-continue').click();
    await expect(page).toHaveURL(/manager_enquiries\?view=enquiries/);
  });
});
