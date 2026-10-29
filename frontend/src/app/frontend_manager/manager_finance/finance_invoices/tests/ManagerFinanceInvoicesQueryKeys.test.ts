import { describe, expect, it } from 'vitest';
import { MANAGER_FINANCE_QUERY_KEYS } from '@/app/frontend_manager/manager_finance/finance_invoices/api/manager_finance_invoices.query_keys';

describe('ManagerFinanceInvoicesQueryKeys', () => {
  it('uses the canonical module namespace and distinct resource keys', () => {
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()[0]).toBe('manager_invoice');
    expect(MANAGER_FINANCE_QUERY_KEYS.refunds()[0]).toBe('manager_invoice');
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()).not.toEqual(MANAGER_FINANCE_QUERY_KEYS.refunds());
  });
});
