import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const moduleRootCandidates = [
  join(process.cwd(), 'src/app/frontend_manager/manager_finance/finance_late_fees'),
  join(process.cwd(), 'app/frontend_manager/manager_finance/finance_late_fees'),
  join(process.cwd(), 'frontend_manager/manager_finance/finance_late_fees'),
  join(process.cwd(), '..', '..'),
  join(process.cwd(), '..'),
  process.cwd(),
];
const moduleRoot = moduleRootCandidates.find((candidate) =>
  existsSync(join(candidate, 'config/manager_finance_late_fees.url_config.ts')) &&
  existsSync(join(candidate, 'components/manager_finance_late_fees_views/ManagerFinanceLateFeesPage.tsx'))
);
if (!moduleRoot) throw new Error('Could not locate canonical manager_finance module root for finance_late_fees.');
const readSource = (relativePath: string) => readFileSync(join(moduleRoot, relativePath), 'utf8');

describe('Finance loading, date formatting and theme invariants — finance_late_fees', () => {
  it('does not encode a perpetual false loading branch in the canonical page', () => {
    const pageSource = readSource('components/manager_finance_late_fees_views/ManagerFinanceLateFeesPage.tsx');
    expect(pageSource).not.toMatch(/const\s+\w*(?:Loading|Pending)\s*=\s*false/);
    expect(pageSource).not.toMatch(/\{\s*\w*(?:Loading|Pending)\s*\?/);
  });

  it('keeps fine-receipt ownership in the canonical fines/payments capability', () => {
    const pageSource = readSource('components/manager_finance_late_fees_views/ManagerFinanceLateFeesPage.tsx');
    expect(pageSource).not.toMatch(/FineReceiptPanel|RefundRequestPanel|RefundProcessDialog/);
    expect(existsSync(join(moduleRoot, '..', 'finance_fines_payments', 'config', 'manager_finance_fines_payments.url_config.ts'))).toBe(true);
    expect(pageSource).toMatch(/role="status"|aria-live=/);
  });

  it('uses semantic animation timing and retains the official WhatsApp brand token', () => {
    const styles = readSource('components/manager_finance_late_fees_styles/ManagerFinanceLateFeesManager_late_fees.css');
    expect(styles).toContain('var(--animate-duration-fast)');
    expect(styles).toContain('--receipt-wa-green: #25D366');
    expect(styles).not.toMatch(/transition[^;]*(?:0\.15s|0\.2s)/);
  });
});
