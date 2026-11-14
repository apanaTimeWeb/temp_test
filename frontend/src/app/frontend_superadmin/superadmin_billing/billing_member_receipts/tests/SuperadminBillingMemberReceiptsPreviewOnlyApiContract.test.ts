// RESPONSIBILITY: Define source-level test coverage for billing member receipts using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_receipts/tests/SuperadminBillingMemberReceiptsPreviewOnlyApiContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMINFINANCERECEIPT_API_CONTRACT_STATUS as contractStatus0 } from '../api/superadmin_billing_invoices_member_receipts.api';
import { SUPERADMINFINANCERECEIPTDETAIL_API_CONTRACT_STATUS as contractStatus1 } from '../api/superadmin_billing_invoices_member_receipts_receipt_detail.api';
import { describe, expect, it } from 'vitest';

describe('superadmin_billing/billing_member_receipts preview-only API contract', () => {
  it('fails closed until an approved backend contract is supplied', () => {
    expect(contractStatus0.status).toMatch(/^(unavailable|CONTRACT_MISSING)$/);
    expect(contractStatus0.networkCallsEnabled).toBe(false);
    expect(contractStatus0.source).toBe('SUPPLIED_FRONTEND_ARCHIVE');
    expect(contractStatus0.requiredInputs).toEqual(['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract']);
    expect(contractStatus1.status).toMatch(/^(unavailable|CONTRACT_MISSING)$/);
    expect(contractStatus1.networkCallsEnabled).toBe(false);
    expect(contractStatus1.source).toBe('SUPPLIED_FRONTEND_ARCHIVE');
    expect(contractStatus1.requiredInputs).toEqual(['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract']);
  });
});
