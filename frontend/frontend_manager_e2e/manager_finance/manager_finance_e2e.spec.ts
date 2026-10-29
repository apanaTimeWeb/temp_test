import { expect, test } from '@playwright/test';

test.describe('Manager finance — transaction safety guardrails', () => {
  test('fee collection stays disabled while the authoritative transaction contract is missing', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_finance/finance_collect_fee?view=collect_fee');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);

    await expect(page.getByRole('heading', { name: 'Collect Fee' })).toBeVisible();
    await expect(page.getByTestId('manager-finance-collect-contract-warning')).toContainText(
      'unavailable until a verified backend contract is supplied',
    );
    const collectionAction = page.getByTestId('manager-finance-collect-submit');
    await expect(collectionAction).toBeDisabled();
    await expect(collectionAction).toContainText('Collection unavailable');

    // Preview-only coupon behavior must never enable the actual money movement.
    await page.getByPlaceholder('Enter coupon code').fill('UNVERIFIED-CODE');
    await page.getByRole('button', { name: 'Apply', exact: true }).click();
    await expect(page.getByTestId('manager-finance-coupon-contract-warning')).toContainText('no discount has been applied');
    await expect(collectionAction).toBeDisabled();
  });

  test('Collect Fee student combobox supports keyboard selection and Escape dismissal', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_finance/finance_collect_fee?view=collect_fee');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    const search = page.getByRole('combobox', { name: /Student/i });
    await search.fill('Aa');
    const listbox = page.getByRole('listbox', { name: /Student/i });
    await expect(listbox).toBeVisible();
    await expect(listbox.getByRole('option').first()).toBeVisible();
    await search.press('ArrowDown');
    await expect(search).toHaveAttribute('aria-activedescendant', /manager-collect-fee-student-option-/);
    await search.press('Escape');
    await expect(listbox).toBeHidden();
    await search.fill('Aa');
    await search.press('ArrowDown');
    await search.press('Enter');
    await expect(listbox).toBeHidden();
    await expect(page.getByText('Aarav Sharma', { exact: true })).toBeVisible();
  });

  test('Collect Fee payment-mode buttons expose the selected mode programmatically', async ({ page }) => {
    await page.goto('/frontend_manager/manager_finance/finance_collect_fee?view=collect_fee');
    const paymentModes = page.getByRole('group', { name: /Payment Mode/i });
    const cash = paymentModes.getByRole('button', { name: 'Cash', exact: true });
    const upi = paymentModes.getByRole('button', { name: 'UPI', exact: true });
    await expect(cash).toHaveAttribute('aria-pressed', 'true');
    await expect(upi).toHaveAttribute('aria-pressed', 'false');
    await upi.click();
    await expect(upi).toHaveAttribute('aria-pressed', 'true');
    await expect(cash).toHaveAttribute('aria-pressed', 'false');
  });

  test('refund controls remain unavailable while refund mutation contracts are absent', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_finance/finance_refunds?view=refunds');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.getByRole('heading', { name: 'Refunds' })).toBeVisible();
    await expect(page.getByTestId('manager-finance-refunds-contract-warning')).toContainText(
      'verified backend mutation contracts are not supplied',
    );

    const disabledRefundActions = page.locator('[data-testid^="manager-finance-refund-process-disabled-"]');
    const disabledDeductionActions = page.locator('[data-testid^="manager-finance-refund-deduction-disabled-"]');
    for (const action of await disabledRefundActions.all()) await expect(action).toBeDisabled();
    for (const action of await disabledDeductionActions.all()) await expect(action).toBeDisabled();
  });

  test('security-deposit refunds and deductions do not present executable transaction controls', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_finance/finance_security_deposits?view=security_deposits');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.getByRole('heading', { name: /Security Deposits/i })).toBeVisible();
    await expect(page.getByTestId('manager-finance-deposits-contract-warning')).toContainText(
      'Refund and deduction actions are disabled until verified backend contracts are supplied',
    );
    const refundButtons = page.getByRole('button', { name: /Process Refund/i });
    const deductionButtons = page.getByRole('button', { name: /Add Deduction/i });
    for (const action of await refundButtons.all()) await expect(action).toBeDisabled();
    for (const action of await deductionButtons.all()) await expect(action).toBeDisabled();
  });

  test('fine collection stays disabled and refund requests route to the canonical refunds owner', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_finance/finance_fines_payments?view=fines_and_payments');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.getByRole('heading', { name: 'Fines & Payments' })).toBeVisible();
    await expect(page.getByTestId('manager-finance-fines-sample-warning')).toBeVisible();

    await page.getByRole('button', { name: 'Collect Fine' }).click();
    await expect(page.getByRole('button', { name: 'Collection unavailable' })).toBeDisabled();

    await page.getByRole('button', { name: 'Refund Requests' }).click();
    await expect(page).toHaveURL(/\/frontend_manager\/manager_finance\/finance_refunds(?:\?.*)?$/);
    await expect(page.getByRole('heading', { name: 'Refunds' })).toBeVisible();
    await expect(page.getByTestId('manager-finance-refunds-contract-warning')).toBeVisible();
    await expect(page.locator('[data-testid^="manager-finance-refund-process-disabled-"]').first()).toBeDisabled();
  });

  test('auto-suspend save and restore controls remain disabled without host contracts', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_finance/finance_auto_suspend?view=auto_suspend');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.getByRole('heading', { name: 'Auto-Suspend Policy' })).toBeVisible();
    await expect(page.getByRole('status')).toContainText('sample data');
    await expect(page.getByRole('button', { name: /Manual Restore unavailable/ }).first()).toBeDisabled();

    const editPolicy = page.getByRole('button', { name: 'Edit', exact: true });
    await expect(editPolicy).toBeDisabled();
    await expect(page.getByRole('button', { name: /Save Config/ })).toHaveCount(0);
  });

  test('renewal screen does not expose an executable renewal or reminder action', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_finance/finance_renewals?view=renewals');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.getByRole('heading', { name: 'Subscription Renewals' })).toBeVisible();
    await expect(page.getByRole('status')).toContainText('sample data');
    await expect(page.getByRole('button', { name: /Remind All/ })).toBeDisabled();
    for (const reminder of await page.getByRole('button', { name: 'Remind', exact: true }).all()) {
      await expect(reminder).toBeDisabled();
    }
    await expect(page.getByRole('button', { name: /Confirm Renewal/ })).toHaveCount(0);
  });


  test('payment promise mutations and detail navigation stay disabled on sample records', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_finance/finance_payment_promises?view=payment_promises');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.getByRole('status')).toContainText('sample');
    await expect(page.getByTestId('manager-finance-payment-promise-mark-paid-disabled').first()).toBeDisabled();
    await expect(page.getByTestId('manager-finance-payment-promise-extend-disabled').first()).toBeDisabled();
    await expect(page.getByRole('button', { name: /View/ }).first()).toBeDisabled();
  });

  test('daily settlement cannot be marked complete from sample client state', async ({ page }) => {
    const response = await page.goto('/frontend_manager/manager_accounts_assets/accounts_daily_settlement?view=daily_settlement');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);
    await expect(page.getByRole('heading', { name: 'Daily Settlement' })).toBeVisible();
    await expect(page.getByTestId('manager-accounting-settlement-contract-warning')).toBeVisible();
    for (const button of await page.getByRole('button', { name: 'Settlement unavailable' }).all()) {
      await expect(button).toBeDisabled();
    }
  });

  test('expense ledger and category maintenance are read-only without mutation contracts', async ({ page }) => {
    await page.goto('/frontend_manager/manager_accounts_assets/accounts_expenses?view=expenses');
    await expect(page.getByTestId('manager-accounting-expenses-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add unavailable' })).toBeDisabled();
    for (const button of await page.getByRole('button', { name: /Delete Expense/ }).all()) {
      await expect(button).toBeDisabled();
    }

    await page.goto('/frontend_manager/manager_accounts_assets/accounts_expenses?view=expense_categories');
    await expect(page.getByTestId('manager-accounting-category-contract-warning')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add unavailable' })).toBeDisabled();
  });


  test('dashboard, referrals and trust-score examples are explicitly marked as sample data', async ({ page }) => {
    const dashboard = await page.goto('/frontend_manager/manager_dashboard/dashboard_reports?view=finance_dashboard');
    expect(dashboard).not.toBeNull();
    expect(dashboard!.status()).toBeLessThan(400);
    await expect(page.getByTestId('manager-finance-dashboard-sample-warning')).toContainText('not live financial records');

    const referrals = await page.goto('/frontend_manager/manager_finance/finance_referrals?view=referrals');
    expect(referrals).not.toBeNull();
    expect(referrals!.status()).toBeLessThan(400);
    await expect(page.getByTestId('manager-finance-referrals-sample-warning')).toContainText('sample data');

    const trustScores = await page.goto('/frontend_manager/manager_finance/finance_trust_scores?view=trust_score');
    expect(trustScores).not.toBeNull();
    expect(trustScores!.status()).toBeLessThan(400);
    await expect(page.getByTestId('manager-finance-trust-score-sample-warning')).toContainText('not live judgments');
  });

  test('late-fee reminders and subscription actions stay unavailable on sample records', async ({ page }) => {
    const lateFees = await page.goto('/frontend_manager/manager_finance/finance_late_fees?view=late_fees');
    expect(lateFees).not.toBeNull();
    expect(lateFees!.status()).toBeLessThan(400);
    await expect(page.getByRole('status')).toContainText('sample data');
    for (const reminder of await page.getByRole('button', { name: /Reminder unavailable/ }).all()) {
      await expect(reminder).toBeDisabled();
    }
    for (const preview of await page.getByRole('button', { name: /Fee preview unavailable/ }).all()) {
      await expect(preview).toBeDisabled();
    }
    const editRules = page.getByRole('button', { name: 'Edit', exact: true });
    await expect(editRules).toBeDisabled();
    await expect(page.getByRole('button', { name: /Save Rules unavailable/ })).toHaveCount(0);

    const subscriptions = await page.goto('/frontend_manager/manager_finance/finance_subscriptions?view=subscriptions');
    expect(subscriptions).not.toBeNull();
    expect(subscriptions!.status()).toBeLessThan(400);
    await expect(page.getByTestId('manager-finance-subscriptions-sample-warning')).toContainText('illustrative sample data only');
    await expect(page.getByRole('button', { name: /CSV unavailable/ })).toBeDisabled();
    await expect(page.getByRole('button', { name: /Print unavailable/ })).toBeDisabled();
    for (const action of await page.getByRole('button', { name: /Renewal unavailable/ }).all()) {
      await expect(action).toBeDisabled();
    }
  });

  test('renewal table uses accessible native sorting while unsupported writes stay disabled', async ({ page }) => {
    await page.goto('/frontend_manager/manager_finance/finance_renewals?view=renewals');
    const sortStudent = page.getByRole('button', { name: 'Sort by Student' });
    await expect(sortStudent).toBeVisible();
    await sortStudent.click();
    await expect(page.getByRole('columnheader', { name: /Student/ })).toHaveAttribute('aria-sort', 'ascending');
    await expect(page.getByRole('button', { name: /Remind All/ })).toBeDisabled();
  });

});
