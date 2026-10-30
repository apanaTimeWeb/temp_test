import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../../frontend_admin/package.json', import.meta.url));
const { expect, test } = require('@playwright/test');

test('category dialog backdrop is decorative and close restores keyboard focus', async ({ page }) => {
  await page.goto('/admin/admin_accounts_assets/accounts_expense_categories');
  await expect(page.getByRole('heading').first()).toBeVisible();

  const addCategory = page.getByRole('button', { name: /add category/i });
  await expect(addCategory).toBeVisible();
  await expect(addCategory).toBeEnabled();
  await addCategory.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');

  const backdrop = page.locator('[data-dialog-backdrop="true"]');
  await expect(backdrop).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('button[data-dialog-backdrop="true"]')).toHaveCount(0);

  await page.getByRole('button', { name: /close add dialog/i }).click();
  await expect(dialog).toHaveCount(0);
  await expect(addCategory).toBeFocused();
});
