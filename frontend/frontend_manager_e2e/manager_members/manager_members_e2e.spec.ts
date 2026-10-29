import { expect, test } from '@playwright/test';

test.describe('Manager members contract guardrails', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/frontend_manager/manager_members/members_directory');
    await expect(page.getByTestId('manager-role-shell')).toBeVisible();
    await expect(page.getByTestId('manager-members-demo-mode-banner')).toContainText('not saved to the host system');
  });

  test('member creation navigates to its canonical route and remains fail-closed without a host contract', async ({ page }) => {
    await page.getByRole('link', { name: 'Add Member', exact: true }).click();
    await expect(page).toHaveURL(/\/frontend_manager\/manager_members\/members_new_admission(?:\?.*)?$/);
    await expect(page.getByRole('heading', { name: /new student admission/i })).toBeVisible();
    await expect(page.getByTestId('manager-students-admission-contract-warning')).toBeVisible();
  });


  test('renewal and document workflows use their canonical route owners', async ({ page }) => {
    await page.getByRole('link', { name: 'Membership Renewal', exact: true }).click();
    await expect(page).toHaveURL(/\/frontend_manager\/manager_finance\/finance_renewals(?:\?.*)?$/);
    await page.goto('/frontend_manager/manager_members/members_directory');
    await page.getByRole('link', { name: 'Member Documents', exact: true }).click();
    await expect(page).toHaveURL(/\/frontend_manager\/manager_members\/members_document_vault(?:\?.*)?$/);
  });

  test('sample member list remains searchable without enabling any write action', async ({ page }) => {
    await expect(page.getByText('Rahul Sharma', { exact: true })).toBeVisible();
    await page.getByPlaceholder('Search by name or ID...').fill('Rahul Sharma');
    await expect(page.getByText('Rahul Sharma', { exact: true })).toBeVisible();
    await expect(page.getByText('Priya Sharma', { exact: true })).toHaveCount(0);
    await expect(page.getByTestId('manager-members-demo-mode-banner')).toContainText('page refresh resets these changes');
  });
});
