import { describe, expect, it } from 'vitest';
import * as api from '@/app/frontend_manager/manager_finance/finance_receipts/api/manager_finance_receipts.api.ts';
import { MANAGERRECEIPTRECEIPT_CONTRACT_GAP_MOCK } from '@/app/frontend_manager/manager_finance/finance_receipts/mocks/ManagerFinanceReceiptsContractGapMock.ts';

describe('manager_receipt fail-closed API contract', () => {
  it('does not make an undocumented network request and exposes a machine-readable gap', async () => {
    expect(MANAGERRECEIPTRECEIPT_CONTRACT_GAP_MOCK).toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    const calls = [
    api.fetchManagerReceiptPayments as (...args: never[]) => Promise<unknown>,
    api.fetchManagerReceiptRefunds as (...args: never[]) => Promise<unknown>,
    ];
    for (const call of calls) {
      await expect(call(...([] as never[]))).rejects.toMatchObject({ code: 'CONTRACT_NOT_FOUND_IN_WEB_ZIP', status: 501 });
    }
  });
});
