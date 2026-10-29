import { describe, expect, it } from 'vitest';
import * as api from '@/app/frontend_manager/manager_finance/finance_invoices/api/manager_finance_invoices.api.ts';
import { MANAGERINVOICEINVOICE_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_finance/finance_invoices/mocks/ManagerFinanceInvoicesContractGapMock.ts';

describe('manager_invoice fail-closed API contract', () => {
  it('does not make an undocumented network request and exposes a machine-readable gap', async () => {
    expect(MANAGERINVOICEINVOICE_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    const calls = [
    api.fetchManagerInvoicePayments as (...args: never[]) => Promise<unknown>,
    api.fetchManagerInvoiceRefunds as (...args: never[]) => Promise<unknown>,
    ];
    for (const call of calls) {
      await expect(call(...([] as never[]))).rejects.toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    }
  });
});
