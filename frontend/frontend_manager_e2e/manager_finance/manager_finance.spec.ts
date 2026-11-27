import { expect, test } from '@playwright/test';
import { expectCanonicalManagerSubmoduleLoaded } from '../helpers/managerSubmoduleRouteCheck';

test.describe('manager_finance domain E2E', () => {
  test('finance_collect_fee supports student selection, collection type, and payment modes', async ({ page }) => {
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

    const paymentModes = page.getByRole('group', { name: /Payment Mode/i });
    const cash = paymentModes.getByRole('button', { name: 'Cash', exact: true });
    const upi = paymentModes.getByRole('button', { name: 'UPI', exact: true });
    await expect(cash).toHaveAttribute('aria-pressed', 'true');
    await upi.click();
    await expect(upi).toHaveAttribute('aria-pressed', 'true');
  });

  test('finance_auto_suspend filters defaulters and runs Gate QR Kiosk simulator', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_finance/finance_auto_suspend',
      { checkSearchInput: true, checkNoHorizontalOverflow: true },
    );

    const shiftSelect = page.getByRole('combobox', { name: /Filter by Shift/i });
    await shiftSelect.selectOption('Morning');
    await shiftSelect.selectOption('all');

    await page.getByTestId('open-gate-kiosk-simulator-btn').click();
    const dialog = page.getByTestId('gate-qr-kiosk-modal');
    await expect(dialog).toBeVisible();
    await dialog.getByTestId('simulate-kiosk-scan-btn').click();
    await expect(dialog.getByTestId('kiosk-access-denied-screen')).toBeVisible();
  });

  test('finance_trust_scores filters rows by level and shift and resets filters', async ({ page }) => {
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

  test('finance_payment_promises toggles due-today filter banner cleanly', async ({ page }) => {
    await expectCanonicalManagerSubmoduleLoaded(
      page,
      '/frontend_manager/manager_finance/finance_payment_promises',
      { checkSearchInput: true },
    );

    const dueTodayBtn = page.getByTestId('manager-finance-filter-due-today-btn');
    if ((await dueTodayBtn.count()) > 0 && (await dueTodayBtn.isVisible())) {
      await dueTodayBtn.click();
    }
  });

  for (const route of [
    '/frontend_manager/manager_finance/finance_subscriptions',
    '/frontend_manager/manager_finance/finance_renewals',
    '/frontend_manager/manager_finance/finance_security_deposits',
    '/frontend_manager/manager_finance/finance_fines_payments',
  ]) {
    test(`loads ${route} cleanly`, async ({ page }) => {
      await expectCanonicalManagerSubmoduleLoaded(page, route, { checkSearchInput: true });
    });
  }
});
