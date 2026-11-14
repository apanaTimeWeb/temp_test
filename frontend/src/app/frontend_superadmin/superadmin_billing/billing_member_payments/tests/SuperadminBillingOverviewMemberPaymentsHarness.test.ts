// RESPONSIBILITY: Define source-level test coverage for billing member payments using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_payments/tests/SuperadminBillingOverviewMemberPaymentsHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_FINANCE_PAYMENTS_EMPTY_DATA_MSW_HANDLERS, SUPERADMIN_FINANCE_PAYMENTS_SERVER_500_MSW_HANDLERS, SUPERADMIN_FINANCE_PAYMENTS_NETWORK_TIMEOUT_MSW_HANDLERS, SUPERADMIN_FINANCE_PAYMENTS_UNAUTHORIZED_401_MSW_HANDLERS, SUPERADMIN_FINANCE_PAYMENTS_FORBIDDEN_403_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/mocks/handlers/SuperadminBillingOverviewMemberPaymentsScenarioMockHandlers';
import { SUPERADMIN_BILLING_MEMBER_PAYMENTS_ROUTES as __SUPERADMIN_BILLING_MEMBER_PAYMENTS_ROUTES, SUPERADMIN_BILLING_MEMBER_PAYMENTS_API as __SUPERADMIN_BILLING_MEMBER_PAYMENTS_API } from "@/app/frontend_superadmin/superadmin_billing/billing_member_payments/config/superadmin_billing_member_payments.url_config";
import { SUPERADMIN_MEMBER_PAYMENTS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/api/superadmin_billing_overview_member_payments.query_keys';

import { SUPERADMIN_FINANCE_PAYMENTS_ERROR_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/mocks/handlers/SuperadminBillingOverviewMemberPaymentsErrorMockHandlers';
import { SUPERADMIN_FINANCE_PAYMENTS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/mocks/handlers/SuperadminBillingOverviewMemberPaymentsMockHandlers';
import { FINANCE_PAYMENTS_MOCK_SERVER, setupFinancePaymentsMockServer } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/tests/harness/SuperadminBillingOverviewMemberPaymentsWorkflowBootstrap';

setupFinancePaymentsMockServer();

describe('member_payments standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_BILLING_MEMBER_PAYMENTS_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_FINANCE_PAYMENTS_URLS.PAGE).toContain('/superadmin/superadmin_billing');
    expect(__SUPERADMIN_BILLING_MEMBER_PAYMENTS_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_PAYMENTS_FINANCE_PAYMENTS_URLS.SCREEN).toBe("/superadmin/superadmin_billing/billing_overview?view=member_payments");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_MEMBER_PAYMENTS_QUERY_KEYS.all[0]).toBe('superadmin_member_payments');
  });
  it('serves a canonical success envelope for payments', async () => {
    FINANCE_PAYMENTS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_PAYMENTS_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_PAYMENTS_API.PAYMENTS_LIST}`);
    expect(response.status).toBe(200);
    const envelope = await response.json() as { success: boolean; message: string; data: unknown; requestId: string };
    expect(envelope).toMatchObject({ success: true, requestId: 'msw-superadmin-payments-list' });
    expect(envelope.message.length).toBeGreaterThan(0);
    expect(envelope.data).toBeDefined();
  });
  it('surfaces a service error for the verified PAYMENTS_LIST read contract', async () => {
    FINANCE_PAYMENTS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_PAYMENTS_ERROR_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_PAYMENTS_API.PAYMENTS_LIST}`);
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ success: false, message: 'Service temporarily unavailable', data: null, errorCode: 'BILLING.PAYMENTS.UNAVAILABLE', statusCode: 503, requestId: 'msw-service-unavailable' });
  });
});

describe('canonical MSW scenario coverage', () => {
  it('returns an empty-data success envelope', async () => {
    FINANCE_PAYMENTS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_PAYMENTS_EMPTY_DATA_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_PAYMENTS_API.PAYMENTS_LIST}`);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true, data: [], meta: { total: 0, page: 1, limit: 1, totalPages: 0 } });
  });
  it('returns a canonical HTTP 500 envelope', async () => {
    FINANCE_PAYMENTS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_PAYMENTS_SERVER_500_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_PAYMENTS_API.PAYMENTS_LIST}`);
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({ success: false, data: null, statusCode: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
  });
  it('returns canonical 401 and 403 envelopes', async () => {
    FINANCE_PAYMENTS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_PAYMENTS_UNAUTHORIZED_401_MSW_HANDLERS);
    const unauthorized = await fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_PAYMENTS_API.PAYMENTS_LIST}`);
    expect(unauthorized.status).toBe(401);
    await expect(unauthorized.json()).resolves.toMatchObject({ success: false, data: null, statusCode: 401, errorCode: 'AUTH.UNAUTHORIZED' });
    FINANCE_PAYMENTS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_PAYMENTS_FORBIDDEN_403_MSW_HANDLERS);
    const forbidden = await fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_PAYMENTS_API.PAYMENTS_LIST}`);
    expect(forbidden.status).toBe(403);
    await expect(forbidden.json()).resolves.toMatchObject({ success: false, data: null, statusCode: 403, errorCode: 'AUTH.FORBIDDEN' });
  });
  it('can abort a deliberately delayed network response', async () => {
    FINANCE_PAYMENTS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_PAYMENTS_NETWORK_TIMEOUT_MSW_HANDLERS);
    await expect(fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_PAYMENTS_API.PAYMENTS_LIST}`, { signal: AbortSignal.timeout(50) })).rejects.toThrow();
  });
});
