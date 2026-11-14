// RESPONSIBILITY: Define source-level test coverage for accounting expenses using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_accounting/accounting_expenses/tests/SuperadminAccountingExpensesPreviewOnlyApiContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMINACCOUNTINGEXPENSESADD_API_CONTRACT_STATUS as contractStatus0 } from '../api/superadmin_accounting_expenses_add.api';
import { SUPERADMINACCOUNTINGEXPENSES_API_CONTRACT_STATUS as contractStatus1 } from '../api/superadmin_accounting_expenses.api';
import { describe, expect, it } from 'vitest';

describe('superadmin_accounting/accounting_expenses preview-only API contract', () => {
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
