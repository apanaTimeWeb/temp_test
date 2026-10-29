import { expect, test } from '@playwright/test';

test.describe('Manager documents — module E2E contract', () => {
  test('canonical route renders the module inside the Manager shell', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_members/members_document_vault');
    expect(response, 'Module navigation must return a document response').not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    expect(new URL(page.url()).pathname).toBe('/frontend_manager/manager_members/members_document_vault');
    await expect(page.getByTestId('manager-role-shell')).toBeVisible();
    await expect(page.getByTestId('manager-main-content')).toBeVisible();
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByTestId('manager-main-content')).not.toBeEmpty();
  await expect(page.getByTestId('manager-documents-contract-warning')).toBeVisible();
  await expect(page.getByRole('button', { name: /upload unavailable/i })).toBeDisabled();
  await page.getByRole('searchbox', { name: 'Search documents...' }).fill('no-such-document-2026');
  await expect(page.getByText('No sample document metadata matches your filters.', { exact: true })).toBeVisible();
  });
});
