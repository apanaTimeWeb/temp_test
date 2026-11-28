import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_finance domain E2E', () => {
  test('finance_collect_fee supports student lookup, collection type switching, composite toggle, and payment modes', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_finance/finance_collect_fee',
      { checkNoHorizontalOverflow: true },
    );

    const studentCombobox = page.getByRole('combobox', { name: /Student/i });
    await studentCombobox.fill('Aa');
    const listbox = page.getByRole('listbox', { name: /Student/i });
    await expect(listbox).toBeVisible();
    await studentCombobox.press('ArrowDown');
    await studentCombobox.press('Enter');
    await expect(listbox).toBeHidden();

    const compositeToggle = page.getByTestId('manager-finance-composite-toggle');
    await expect(compositeToggle).toBeAttached();
    const compositeLabel = compositeToggle.locator('..');
    await compositeLabel.click();
    await expect(compositeToggle).toBeChecked();
    await compositeLabel.click();
    await expect(compositeToggle).not.toBeChecked();

    await expect(page.getByText('Amount Paying: ₹1,200')).toBeVisible();
    await page.getByRole('radio', { name: /Partial Payment/i }).click();
    await expect(page.getByRole('radio', { name: /Partial Payment/i })).toHaveAttribute('aria-checked', 'true');
    const paymentModes = page.getByRole('group', { name: /Payment Mode/i });
    const cash = paymentModes.getByRole('button', { name: 'Cash', exact: true });
    const upi = paymentModes.getByRole('button', { name: 'UPI', exact: true });
    await expect(cash).toHaveAttribute('aria-pressed', 'true');
    await upi.click();
    await expect(upi).toHaveAttribute('aria-pressed', 'true');
    await expect(cash).toHaveAttribute('aria-pressed', 'false');
  });

  test('finance_auto_suspend filters defaulters and runs Gate QR Kiosk simulator', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_finance/finance_auto_suspend',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const rows = page.getByTestId('manager-main-content').locator('tbody tr');
    const initialCount = await rows.count();
    expect(initialCount).toBeGreaterThan(0);

    const shiftSelect = page.getByRole('combobox', { name: /Filter by Shift/i });
    await shiftSelect.selectOption('Morning');
    const morningCount = await rows.count();
    expect(morningCount).toBeLessThanOrEqual(initialCount);
    await shiftSelect.selectOption('all');
    await expect(rows).toHaveCount(initialCount);

    await page.getByTestId('open-gate-kiosk-simulator-btn').click();
    const dialog = page.getByTestId('gate-qr-kiosk-modal');
    await expect(dialog).toBeVisible();
    await dialog.getByTestId('simulate-kiosk-scan-btn').click();
    await expect(dialog.getByTestId('kiosk-access-denied-screen')).toBeVisible();
  });

  test('finance_trust_scores filters rows by level and resets back to full roster', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_finance/finance_trust_scores',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const rows = page.getByRole('main').locator('tbody tr');
    const initialCount = await rows.count();
    expect(initialCount).toBeGreaterThan(0);

    await page.locator('#trust-scores-level-filter').selectOption('reliable');
    const filteredCount = await rows.count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    await page.getByRole('button', { name: /Reset Filters/i }).click();
    await expect(rows).toHaveCount(initialCount);
  });

  test('finance_payment_promises filters due-today and status rows cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_finance/finance_payment_promises',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(5);

    const dueTodayBtn = page.getByTestId('manager-finance-filter-due-today-btn');
    await dueTodayBtn.click();
    await expect(main.getByText('Aman Verma')).toHaveCount(0);
    await page.getByRole('button', { name: 'All Time', exact: true }).click();
    await expect(rows).toHaveCount(5);
    await expect(main.getByText('Aman Verma')).toBeVisible();

    const statusSelect = page.locator('#promises-status-filter');
    await statusSelect.selectOption('overdue');
    await expect(main.getByText('Rahul Kumar')).toHaveCount(0);
    await expect(main.getByText('Priya Singh')).toBeVisible();
    await statusSelect.selectOption('all');
    await expect(rows).toHaveCount(5);
  });

  test('finance_subscriptions opens pro-rata upgrade calculator and closes cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_finance/finance_subscriptions',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const upgradeBtn = page.getByRole('button', { name: 'Upgrade' }).first();
    await expect(upgradeBtn).toBeVisible();
    await upgradeBtn.click();
    const modal = page.getByTestId('manager-finance-upgrade-modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('pro-rata-calculator-breakdown')).toBeVisible();
    await modal.getByRole('button', { name: /Cancel/i }).first().click();
    await expect(modal).toBeHidden();
  });

  test('finance_renewals filters dues by shift, resets rows, and opens bulk WhatsApp reminders modal', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_finance/finance_renewals',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(2);

    await page.getByLabel('Filter by Shift').selectOption('Morning');
    await expect(rows).toHaveCount(1);
    await expect(main.getByText('Priya Patel')).toHaveCount(0);
    await expect(main.getByText('Vikram Rao')).toBeVisible();

    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(rows).toHaveCount(2);
    await expect(main.getByText('Priya Patel')).toBeVisible();

    await page.getByTestId('manager-finance-1click-3day-whatsapp').click();
    const heading = page.getByRole('heading', { name: 'Bulk Renewal WhatsApp Reminders' });
    await expect(heading).toBeVisible();
    await page.getByRole('button', { name: /Close/i }).first().click();
    await expect(heading).toBeHidden();
  });

  test('finance_security_deposits filters rows by status and opens exit clearance & refund modal', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_finance/finance_security_deposits',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    const rows = main.locator('tbody tr');
    await expect(rows).toHaveCount(5);

    const statusSelect = page.locator('#security-deposits-status-filter');
    await statusSelect.selectOption('refunded');
    await expect(main.getByText('Rahul Kumar')).toHaveCount(0);
    await expect(main.getByText('Aman Verma')).toBeVisible();

    await statusSelect.selectOption('all');
    await expect(rows).toHaveCount(5);
    await expect(main.getByText('Rahul Kumar')).toBeVisible();

    await page.getByTestId('refund-deposit-btn-1').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /Cancel|Close/i }).first().click();
    await expect(dialog).toBeHidden();
  });

  test('finance_fines_payments switches between fine ledger tabs and receipts table', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_finance/finance_fines_payments',
      { checkNoHorizontalOverflow: true },
    );

    const main = page.getByTestId('manager-main-content');
    await page.getByRole('button', { name: /Pending Fines/i }).click();
    await expect(main.locator('table').first()).toBeVisible();
    expect(await main.locator('tbody tr').count()).toBeGreaterThan(0);

    await page.getByRole('button', { name: /View Receipts Ledger/i }).click();
    await expect(main.locator('table').first()).toBeVisible();
    expect(await main.locator('tbody tr').count()).toBeGreaterThan(0);
  });
});
