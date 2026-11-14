// RESPONSIBILITY: Define source-level test coverage for support complaints using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_support/support_complaints/tests/SuperadminSupportComplaintsHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_SUPPORT_COMPLAINTS_EMPTY_DATA_MSW_HANDLERS, SUPERADMIN_SUPPORT_COMPLAINTS_SERVER_500_MSW_HANDLERS, SUPERADMIN_SUPPORT_COMPLAINTS_NETWORK_TIMEOUT_MSW_HANDLERS, SUPERADMIN_SUPPORT_COMPLAINTS_UNAUTHORIZED_401_MSW_HANDLERS, SUPERADMIN_SUPPORT_COMPLAINTS_FORBIDDEN_403_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_support/support_complaints/mocks/handlers/SuperadminSupportComplaintsScenarioMockHandlers';
import { SUPERADMIN_SUPPORT_COMPLAINTS_ROUTES as __SUPERADMIN_SUPPORT_COMPLAINTS_ROUTES, SUPERADMIN_SUPPORT_COMPLAINTS_API as __SUPERADMIN_SUPPORT_COMPLAINTS_API } from "@/app/frontend_superadmin/superadmin_support/support_complaints/config/superadmin_support_complaints.url_config";
import { SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_support/support_complaints/api/superadmin_support_complaints.query_keys';
import { SUPERADMIN_SUPPORT_COMPLAINT_STATUS, SUPERADMIN_SUPPORT_COMPLAINT_STATUS_FILTERS } from '@/app/frontend_superadmin/superadmin_support/support_complaints/constants/SuperadminSupportComplaintsStaticConstants';
import { readFileSync } from 'node:fs';

import { SUPERADMIN_SUPPORT_COMPLAINTS_ERROR_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_support/support_complaints/mocks/handlers/SuperadminSupportComplaintsErrorMockHandlers';
import { SUPERADMIN_SUPPORT_COMPLAINTS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_support/support_complaints/mocks/handlers/SuperadminSupportComplaintsMockHandlers';
import { COMMUNICATION_COMPLAINTS_MOCK_SERVER, setupCommunicationComplaintsMockServer } from '@/app/frontend_superadmin/superadmin_support/support_complaints/tests/harness/bootstrap';

setupCommunicationComplaintsMockServer();

describe('support_complaints standalone contract', () => {
  it('uses the canonical status registry and exposes pressed state for the active filter', () => {
    const page = readFileSync(new URL('../components/SuperadminSupportComplaintsPageClient.tsx', import.meta.url), 'utf8');
    expect(SUPERADMIN_SUPPORT_COMPLAINT_STATUS_FILTERS).toContain(SUPERADMIN_SUPPORT_COMPLAINT_STATUS.IN_PROGRESS);
    expect(page).toContain('aria-pressed={tab === t}');
    expect(page).toContain('c.status === SUPERADMIN_SUPPORT_COMPLAINT_STATUS.OPEN');
    expect(page).toContain('c.status !== SUPERADMIN_SUPPORT_COMPLAINT_STATUS.RESOLVED');
  });
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_SUPPORT_COMPLAINTS_ROUTES.SUPERADMIN_SUPPORT_COMPLAINTS_URLS.PAGE).toBe('/superadmin/superadmin_support/support_complaints');
    expect(__SUPERADMIN_SUPPORT_COMPLAINTS_ROUTES.SUPERADMIN_SUPPORT_COMPLAINTS_URLS.SCREEN).toBe("/superadmin/superadmin_support/support_complaints");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_SUPPORT_COMPLAINTS_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_support", "support_complaints"]);
  });
  it('serves a canonical success envelope for complaints', async () => {
    COMMUNICATION_COMPLAINTS_MOCK_SERVER.use(...SUPERADMIN_SUPPORT_COMPLAINTS_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_SUPPORT_COMPLAINTS_API.COMPLAINTS_LIST}`);
    expect(response.status).toBe(200);
    const envelope = await response.json() as { success: boolean; message: string; data: unknown; requestId: string };
    expect(envelope).toMatchObject({ success: true, requestId: 'msw-superadmin-complaints-list' });
    expect(envelope.message.length).toBeGreaterThan(0);
    expect(envelope.data).toBeDefined();
  });
  it('surfaces a service error for the verified COMPLAINTS_LIST read contract', async () => {
    COMMUNICATION_COMPLAINTS_MOCK_SERVER.use(...SUPERADMIN_SUPPORT_COMPLAINTS_ERROR_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_SUPPORT_COMPLAINTS_API.COMPLAINTS_LIST}`);
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ success: false, message: 'Service temporarily unavailable', data: null, errorCode: 'SUPPORT.COMPLAINTS.UNAVAILABLE', statusCode: 503, requestId: 'msw-service-unavailable' });
  });
});

describe('canonical MSW scenario coverage', () => {
  it('returns an empty-data success envelope', async () => {
    COMMUNICATION_COMPLAINTS_MOCK_SERVER.use(...SUPERADMIN_SUPPORT_COMPLAINTS_EMPTY_DATA_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_SUPPORT_COMPLAINTS_API.COMPLAINTS_LIST}`);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true, data: [], meta: { total: 0, page: 1, limit: 1, totalPages: 0 } });
  });
  it('returns a canonical HTTP 500 envelope', async () => {
    COMMUNICATION_COMPLAINTS_MOCK_SERVER.use(...SUPERADMIN_SUPPORT_COMPLAINTS_SERVER_500_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_SUPPORT_COMPLAINTS_API.COMPLAINTS_LIST}`);
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({ success: false, data: null, statusCode: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
  });
  it('returns canonical 401 and 403 envelopes', async () => {
    COMMUNICATION_COMPLAINTS_MOCK_SERVER.use(...SUPERADMIN_SUPPORT_COMPLAINTS_UNAUTHORIZED_401_MSW_HANDLERS);
    const unauthorized = await fetch(`http://localhost${__SUPERADMIN_SUPPORT_COMPLAINTS_API.COMPLAINTS_LIST}`);
    expect(unauthorized.status).toBe(401);
    await expect(unauthorized.json()).resolves.toMatchObject({ success: false, data: null, statusCode: 401, errorCode: 'AUTH.UNAUTHORIZED' });
    COMMUNICATION_COMPLAINTS_MOCK_SERVER.use(...SUPERADMIN_SUPPORT_COMPLAINTS_FORBIDDEN_403_MSW_HANDLERS);
    const forbidden = await fetch(`http://localhost${__SUPERADMIN_SUPPORT_COMPLAINTS_API.COMPLAINTS_LIST}`);
    expect(forbidden.status).toBe(403);
    await expect(forbidden.json()).resolves.toMatchObject({ success: false, data: null, statusCode: 403, errorCode: 'AUTH.FORBIDDEN' });
  });
  it('can abort a deliberately delayed network response', async () => {
    COMMUNICATION_COMPLAINTS_MOCK_SERVER.use(...SUPERADMIN_SUPPORT_COMPLAINTS_NETWORK_TIMEOUT_MSW_HANDLERS);
    await expect(fetch(`http://localhost${__SUPERADMIN_SUPPORT_COMPLAINTS_API.COMPLAINTS_LIST}`, { signal: AbortSignal.timeout(50) })).rejects.toThrow();
  });
});
