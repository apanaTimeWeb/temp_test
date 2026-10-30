import { describe, expect, it } from 'vitest';
import en from '@/app/frontend_admin/admin_finance/finance_dashboard/locales/admin_finance_dashboard_en.json';
import hi from '@/app/frontend_admin/admin_finance/finance_dashboard/locales/admin_finance_dashboard_hi.json';

const namespaces = [
  'ADMIN_FINANCE_REFERRALS',
  'ADMIN_FINANCE_LATE_FEES',
  'ADMIN_FINANCE_SECURITY_DEPOSITS',
  'ADMIN_FINANCE_PAYMENT_PROMISES',
  'ADMIN_FINANCE_AUTO_SUSPEND',
  'ADMIN_FINANCE_TRUST_SCORE',
  'ADMIN_FINANCE_DASHBOARD',
  'ADMIN_FINANCE_LEDGER_PAGES',
  'ADMIN_FINANCE_INVOICE_DETAIL',
  'ADMIN_FINANCE_RECEIPT_DETAIL',
] as const;

describe('Finance legacy page localization catalogs', () => {
  it.each(namespaces)('%s has matching non-empty English and Hindi entries', (namespace) => {
    const english = en[namespace] as Record<string, string>;
    const hindi = hi[namespace] as Record<string, string>;
    expect(Object.keys(english).sort()).toEqual(Object.keys(hindi).sort());
    expect(Object.keys(english).length).toBeGreaterThan(0);
    for (const key of Object.keys(english)) {
      expect(english[key], `Missing English ${namespace}.${key}`).toBeDefined();
      expect(hindi[key], `Missing Hindi ${namespace}.${key}`).toBeDefined();
      expect(english[key]?.trim(), `English ${namespace}.${key}`).not.toBe('');
      expect(hindi[key]?.trim(), `Hindi ${namespace}.${key}`).not.toBe('');
    }
  });
});
