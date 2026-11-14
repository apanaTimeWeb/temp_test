// RESPONSIBILITY: Define source-level test coverage for billing member payment promises using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_payment_promises/tests/SuperadminBillingMemberPaymentPromisesPreviewOnlyApiContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { SUPERADMINFINANCEPAYMENTPROMISES_API_CONTRACT_STATUS as contractStatus0 } from '../api/superadmin_billing_overview_member_payment_promises.api';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('superadmin_billing/billing_member_payment_promises preview-only API contract', () => {
  it('fails closed until an approved backend contract is supplied', () => {
    expect(contractStatus0.status).toMatch(/^(unavailable|CONTRACT_MISSING)$/);
    expect(contractStatus0.networkCallsEnabled).toBe(false);
    expect(contractStatus0.source).toBe('SUPPLIED_FRONTEND_ARCHIVE');
    expect(contractStatus0.requiredInputs).toEqual(['approved-endpoint', 'request-schema', 'response-schema', 'authorization-contract']);
  });
  it('validates the extension form and updates only browser preview state', () => {
    const page = readFileSync(resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/components/SuperadminBillingOverviewMemberPaymentPromisesPageClient.tsx'), 'utf8');
    const schema = readFileSync(resolve(process.cwd(), 'src/app/frontend_superadmin/superadmin_billing/billing_member_payment_promises/schemas/superadmin_billing_member_payment_promises.schemas.ts'), 'utf8');
    expect(page).toContain('zodResolver(SuperadminBillingOverviewMemberPaymentPromisesExtensionSchema)');
    expect(page).toContain('setPromises((previous) => previous.map');
    expect(page).toContain('PROMISE_DATE_CHANGED_LOCALLY_PREVIEW');
    expect(page).not.toContain('apiFetch');
    expect(schema).toContain('isValidCalendarDate');
    expect(schema).toContain('EXTENSION_REASON_REQUIRED');
  });
});
