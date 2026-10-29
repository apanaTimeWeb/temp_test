import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const frontendManagerRoot = [
  join(process.cwd(), 'src/app/frontend_manager'),
  join(process.cwd(), 'app/frontend_manager'),
  join(process.cwd(), 'frontend_manager'),
].find(existsSync);
if (!frontendManagerRoot) throw new Error('Could not locate frontend_manager from the test working directory.');
const readSource = (relativePath: string) => readFileSync(join(frontendManagerRoot, relativePath), 'utf8');

describe('Finance contract-dependent interaction closure', () => {
  it('keeps policy editing unavailable at the entry point while no write contract exists', () => {
    for (const file of [
      'manager_finance/finance_auto_suspend/components/manager_finance_auto_suspend_views/ManagerFinanceAutoSuspendPage.tsx',
      'manager_finance/finance_late_fees/components/manager_finance_late_fees_views/ManagerFinanceLateFeesPage.tsx',
    ]) {
      const source = readSource(file);
      expect(source, file).toMatch(/<button[^>]*disabled[^>]*title=\{tManagerUi\('save_unavailable_verified_api_contract_not_supplied'\)\}/s);
      expect(source, file).not.toMatch(/setIsEditing\s*\(/);
      expect(source, file).not.toMatch(/setEditing\s*\(/);
    }
  });

  it('does not present sample payment promise mutations or navigation as active', () => {
    const source = readSource('manager_finance/finance_payment_promises/components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesPage.tsx');
    for (const testId of ['manager-finance-payment-promise-mark-paid-disabled', 'manager-finance-payment-promise-extend-disabled']) {
      const buttonTag = source.match(new RegExp(`<button\\b[^>]*data-testid=\"${testId}\"[^>]*>`, 's'))?.[0];
      expect(buttonTag, testId).toBeTruthy();
      expect(buttonTag ?? '', testId).toMatch(/\bdisabled\b/);
    }
    expect(source).toContain("mark_paid_unavailable_verified_api_contract_not_supplied");
    expect(source).toContain("extend_date_unavailable_verified_api_contract_not_suppli_5bf7b2");
    expect(source).not.toContain('extendDialog');
    expect(source).not.toContain('setExtendDialog');
    expect(source).toMatch(/<button[^>]*type="button"[^>]*disabled[^>]*title=\{tManagerUi\('detail_route_is_outside_the_supplied_frontend_contract'\)\}/s);
  });

  it('keeps sample-backed late-fee contact and preview actions disabled', () => {
    const source = readSource('manager_finance/finance_late_fees/components/manager_finance_late_fees_views/ManagerFinanceLateFeesPage.tsx');
    expect(source).toMatch(/manager-finance-late-fee-sample-preview-disabled[\s\S]*?disabled/);
    expect(source).toMatch(/manager-finance-late-fee-sample-reminder-disabled[\s\S]*?disabled/);
    expect(source).not.toMatch(/openWhatsApp|sendWhatsAppReminder/);
  });

  it('does not expose constant-false loading UI in the sample-backed policy screen', () => {
    const source = readSource('manager_finance/finance_auto_suspend/components/manager_finance_auto_suspend_views/ManagerFinanceAutoSuspendPage.tsx');
    expect(source).not.toMatch(/const\s+(?:configLoading|suspendedLoading)\s*=\s*false/);
    expect(source).not.toMatch(/\{(?:configLoading|suspendedLoading)\s*\?/);
  });
});


describe('Collect Fee accessible controls', () => {
  it('provides a keyboard-operable student combobox and listbox', () => {
    const source = readSource('manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeePage.tsx');
    expect(source).toContain('role="combobox"');
    expect(source).toContain('role="listbox"');
    expect(source).toContain('aria-activedescendant=');
    expect(source).toContain('handleStudentSearchKeyDown');
    expect(source).toContain("event.key === 'Escape'");
    expect(source).toContain("event.key === 'ArrowDown'");
    expect(source).toContain("event.key === 'ArrowUp'");
  });

  it('exposes payment-mode selection through aria-pressed', () => {
    const source = readSource('manager_finance/finance_collect_fee/components/manager_finance_collect_fee_views/ManagerFinanceCollectFeePage.tsx');
    expect(source).toContain('aria-pressed={mode === m}');
  });
});
