// RESPONSIBILITY: Define source-level test coverage for billing member refunds using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_refunds/tests/SuperadminBillingOverviewMemberRefundsHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_FINANCE_REFUNDS_EMPTY_DATA_MSW_HANDLERS, SUPERADMIN_FINANCE_REFUNDS_SERVER_500_MSW_HANDLERS, SUPERADMIN_FINANCE_REFUNDS_NETWORK_TIMEOUT_MSW_HANDLERS, SUPERADMIN_FINANCE_REFUNDS_UNAUTHORIZED_401_MSW_HANDLERS, SUPERADMIN_FINANCE_REFUNDS_FORBIDDEN_403_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/mocks/handlers/SuperadminBillingOverviewMemberRefundsScenarioMockHandlers';
import { SUPERADMIN_BILLING_MEMBER_REFUNDS_ROUTES as __SUPERADMIN_BILLING_MEMBER_REFUNDS_ROUTES, SUPERADMIN_BILLING_MEMBER_REFUNDS_API as __SUPERADMIN_BILLING_MEMBER_REFUNDS_API } from "@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/config/billing_member_refunds.url_config";
import { SUPERADMIN_MEMBER_REFUNDS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/api/superadmin_billing_overview_member_refunds.query_keys';

import { SUPERADMIN_FINANCE_REFUNDS_ERROR_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/mocks/handlers/SuperadminBillingOverviewMemberRefundsErrorMockHandlers';
import { SUPERADMIN_FINANCE_REFUNDS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/mocks/handlers/SuperadminBillingOverviewMemberRefundsMockHandlers';
import { FINANCE_REFUNDS_MOCK_SERVER, setupFinanceRefundsMockServer } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/tests/harness/SuperadminBillingOverviewMemberRefundsWorkflowBootstrap';

setupFinanceRefundsMockServer();

describe('member_refunds standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_BILLING_MEMBER_REFUNDS_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_REFUNDS_URLS.PAGE).toContain('/superadmin/superadmin_billing');
    expect(__SUPERADMIN_BILLING_MEMBER_REFUNDS_ROUTES.SUPERADMIN_BILLING_OVERVIEW_MEMBER_REFUNDS_FINANCE_REFUNDS_URLS.SCREEN).toBe("/superadmin/superadmin_billing/billing_overview?view=member_refunds");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_MEMBER_REFUNDS_QUERY_KEYS.all[0]).toBe('superadmin_member_refunds');
  });
  it('serves a canonical success envelope for refunds', async () => {
    FINANCE_REFUNDS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_REFUNDS_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_REFUNDS_API.REFUNDS_LIST}`);
    expect(response.status).toBe(200);
    const envelope = await response.json() as { success: boolean; message: string; data: unknown; requestId: string };
    expect(envelope).toMatchObject({ success: true, requestId: 'msw-superadmin-refunds-list' });
    expect(envelope.message.length).toBeGreaterThan(0);
    expect(envelope.data).toBeDefined();
  });
  it('surfaces a service error for the verified REFUNDS_LIST read contract', async () => {
    FINANCE_REFUNDS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_REFUNDS_ERROR_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_REFUNDS_API.REFUNDS_LIST}`);
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ success: false, message: 'Service temporarily unavailable', data: null, errorCode: 'BILLING.REFUNDS.UNAVAILABLE', statusCode: 503, requestId: 'msw-service-unavailable' });
  });
});

describe('canonical MSW scenario coverage', () => {
  it('returns an empty-data success envelope', async () => {
    FINANCE_REFUNDS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_REFUNDS_EMPTY_DATA_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_REFUNDS_API.REFUNDS_LIST}`);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true, data: [], meta: { total: 0, page: 1, limit: 1, totalPages: 0 } });
  });
  it('returns a canonical HTTP 500 envelope', async () => {
    FINANCE_REFUNDS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_REFUNDS_SERVER_500_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_REFUNDS_API.REFUNDS_LIST}`);
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({ success: false, data: null, statusCode: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
  });
  it('returns canonical 401 and 403 envelopes', async () => {
    FINANCE_REFUNDS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_REFUNDS_UNAUTHORIZED_401_MSW_HANDLERS);
    const unauthorized = await fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_REFUNDS_API.REFUNDS_LIST}`);
    expect(unauthorized.status).toBe(401);
    await expect(unauthorized.json()).resolves.toMatchObject({ success: false, data: null, statusCode: 401, errorCode: 'AUTH.UNAUTHORIZED' });
    FINANCE_REFUNDS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_REFUNDS_FORBIDDEN_403_MSW_HANDLERS);
    const forbidden = await fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_REFUNDS_API.REFUNDS_LIST}`);
    expect(forbidden.status).toBe(403);
    await expect(forbidden.json()).resolves.toMatchObject({ success: false, data: null, statusCode: 403, errorCode: 'AUTH.FORBIDDEN' });
  });
  it('can abort a deliberately delayed network response', async () => {
    FINANCE_REFUNDS_MOCK_SERVER.use(...SUPERADMIN_FINANCE_REFUNDS_NETWORK_TIMEOUT_MSW_HANDLERS);
    await expect(fetch(`http://localhost${__SUPERADMIN_BILLING_MEMBER_REFUNDS_API.REFUNDS_LIST}`, { signal: AbortSignal.timeout(50) })).rejects.toThrow();
  });
});
