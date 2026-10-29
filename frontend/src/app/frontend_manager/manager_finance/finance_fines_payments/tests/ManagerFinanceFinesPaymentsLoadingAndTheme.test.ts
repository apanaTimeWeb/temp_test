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

describe('Finance loading, date, and theme source contracts', () => {
  it('does not retain constant-false loading branches on sample-backed Finance pages', () => {
    for (const file of [
      'manager_finance/finance_subscriptions/components/manager_finance_subscriptions_views/ManagerFinanceSubscriptionsPage.tsx',
      'manager_finance/finance_late_fees/components/manager_finance_late_fees_views/ManagerFinanceLateFeesPage.tsx',
      'manager_finance/finance_payment_promises/components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesPage.tsx',
      'manager_finance/finance_referrals/components/manager_finance_referrals_views/ManagerFinanceReferralsPage.tsx',
      'manager_finance/finance_security_deposits/components/manager_finance_security_deposits_views/ManagerFinanceSecurityDepositsPage.tsx',
      'manager_finance/finance_subscriptions/components/manager_finance_subscriptions_views/ManagerFinanceSubscriptionsPage.tsx',
      'manager_finance/finance_trust_scores/components/manager_finance_trust_scores_views/ManagerFinanceTrustScoresTrustScorePage.tsx',
    ]) {
      const source = readSource(file);
      expect(source, file).not.toMatch(/const\s+isLoading\s*=\s*false\s*;/);
      expect(source, file).not.toContain('{isLoading ?');
    }
  });

  it('formats Finance-facing dates through the module formatter', () => {
    const promises = readSource('manager_finance/finance_payment_promises/components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesPage.tsx');
    const dashboard = readSource('manager_finance/finance_subscriptions/components/manager_finance_subscriptions_views/ManagerFinanceSubscriptionsPage.tsx');
    const receipt = readSource('manager_finance/finance_fines_payments/components/manager_finance_fines_payments_widgets/ManagerFinanceFinesPaymentsFineReceiptPanel.tsx');
    expect(promises).toContain('formatDate(p.expectedDate)');
    expect(promises).toContain(`p.fulfilledDate ? formatDate(p.fulfilledDate) : '—'`);
    expect(dashboard).toContain('formatDate(s.startDate)');
    expect(dashboard).toContain('formatDate(s.endDate)');
    expect(receipt).toContain('formatDateTime(receipt.date)');
    expect(receipt).not.toContain('${tManagerUi(\'date_time\')}: ${receipt.date}');
  });

  it('uses design-system motion duration and semantic receipt accent tokens', () => {
    const css = readSource('manager_finance/finance_fines_payments/components/manager_finance_fines_payments_styles/ManagerFinanceFinesPaymentsManager_fines_payments.css');
    expect(css).toContain('--receipt-wa-green: theme(--color-success);');
    expect(css).toContain('color: var(--receipt-wa-green);');
    expect(css).toMatch(/transition:\s*[^;]*var\(--animate-duration-fast\)/);
    expect(css).not.toMatch(/transition:\s*[^;]*0\.(?:15|2)s\b/);
  });
});
