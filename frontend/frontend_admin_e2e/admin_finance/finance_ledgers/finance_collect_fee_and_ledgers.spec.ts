import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../../frontend_admin/package.json', import.meta.url));
const { expect, test } = require('@playwright/test');

const demoOnly = () => test.skip(
  process.env.PLAYWRIGHT_APP_MODE !== 'demo',
  'Requires PLAYWRIGHT_APP_MODE=demo and a server built with NEXT_PUBLIC_FRONTEND_DEMO_MODE=true.',
);

test('invoice list detail links resolve every demo invoice identity', async ({ page }) => {
  demoOnly();
  await page.goto('/admin/admin_finance/finance_invoices');
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

  const links = page.locator('a[href*="/admin/admin_finance/finance_invoices?view=detail&id="]');
  const hrefs = await links.evaluateAll((anchors: HTMLAnchorElement[]) => anchors.map((anchor) => anchor.getAttribute('href')).filter((href): href is string => Boolean(href)));
  expect(hrefs).toHaveLength(5);
  const invoiceNumbers: Record<string, string> = {
    '1': 'INV-20260411-001',
    '2': 'INV-20260410-002',
    '3': 'INV-20260409-003',
    '4': 'INV-20260408-004',
    '5': 'INV-20260407-005',
  };

  for (const href of hrefs) {
    const url = new URL(href, page.url());
    const id = url.searchParams.get('id') ?? '';
    await page.goto(url.toString());
    await expect(page.getByRole('heading', { name: /tax invoice/i }).first()).toBeVisible();
    await expect(page.getByText(invoiceNumbers[id], { exact: false }).first()).toBeVisible();
    if (id !== '1') await expect(page.getByText(/additional invoice line items are not available/i)).toBeVisible();
  }

  await page.goto('/admin/admin_finance/finance_invoices?view=detail&id=not-a-real-invoice');
  await expect(page.getByRole('heading', { name: /invoice not found/i })).toBeVisible();
});

test('receipt list detail links resolve every demo receipt identity', async ({ page }) => {
  demoOnly();
  await page.goto('/admin/admin_finance/finance_receipts');
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();

  const links = page.locator('a[href*="/admin/admin_finance/finance_receipts?view=detail&id="]');
  const hrefs = await links.evaluateAll((anchors: HTMLAnchorElement[]) => anchors.map((anchor) => anchor.getAttribute('href')).filter((href): href is string => Boolean(href)));
  expect(hrefs).toHaveLength(5);
  const receiptNumbers: Record<string, string> = {
    'SL360-TRX-99421-X': 'REC-20260411-001',
    'SL360-TRX-88310-Y': 'REC-20260410-002',
    'SL360-TRX-77203-Z': 'REC-20260409-003',
    'SL360-TRX-66192-A': 'REC-20260408-004',
    'SL360-TRX-55081-B': 'REC-20260407-005',
  };

  for (const href of hrefs) {
    const url = new URL(href, page.url());
    const id = url.searchParams.get('id') ?? '';
    await page.goto(url.toString());
    await expect(page.getByRole('heading', { name: /payment receipt/i }).first()).toBeVisible();
    await expect(page.getByText(receiptNumbers[id], { exact: false }).first()).toBeVisible();
    if (id !== 'SL360-TRX-99421-X') await expect(page.getByText(/additional receipt line items are not available/i)).toBeVisible();
  }

  await page.goto('/admin/admin_finance/finance_receipts?view=detail&id=not-a-real-receipt');
  await expect(page.getByRole('heading', { name: /receipt not found/i })).toBeVisible();
});

test('collect-fee dirty form asks before internal navigation and honors the decision', async ({ page }) => {
  demoOnly();
  await page.goto('/admin/admin_finance/finance_collect_fee');
  const studentSearch = page.getByRole('textbox', { name: 'Search student by name or Smart ID' });
  await studentSearch.fill('Aarav');
  const studentOption = page.getByRole('button', { name: /Aarav Sharma/ });
  await expect(studentOption).toBeVisible();
  await studentOption.click();

  const invoicesLink = page.locator('a[href="/admin/admin_finance/finance_invoices"]').first();
  await expect(invoicesLink).toBeAttached();
  await invoicesLink.click();
  const dialog = page.getByRole('alertdialog');
  await expect(dialog.getByRole('heading', { name: /leave this page with unsaved changes/i })).toBeVisible();
  await dialog.getByRole('button', { name: 'Keep editing' }).click();
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_collect_fee(?:[?#]|$)/);

  await invoicesLink.click();
  await expect(page.getByRole('alertdialog')).toBeVisible();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Discard changes' }).click();
  await expect(page).toHaveURL(/\/admin\/admin_finance\/finance_invoices(?:[?#]|$)/);
});
