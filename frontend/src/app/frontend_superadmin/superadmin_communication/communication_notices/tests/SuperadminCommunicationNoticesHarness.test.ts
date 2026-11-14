// RESPONSIBILITY: Define source-level test coverage for communication notices using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_communication/communication_notices/tests/SuperadminCommunicationNoticesHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_COMMUNICATION_NOTICES_EMPTY_DATA_MSW_HANDLERS, SUPERADMIN_COMMUNICATION_NOTICES_SERVER_500_MSW_HANDLERS, SUPERADMIN_COMMUNICATION_NOTICES_NETWORK_TIMEOUT_MSW_HANDLERS, SUPERADMIN_COMMUNICATION_NOTICES_UNAUTHORIZED_401_MSW_HANDLERS, SUPERADMIN_COMMUNICATION_NOTICES_FORBIDDEN_403_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/mocks/handlers/SuperadminCommunicationNoticesScenarioMockHandlers';
import { SUPERADMIN_COMMUNICATION_NOTICES_ROUTES as __SUPERADMIN_COMMUNICATION_NOTICES_ROUTES, SUPERADMIN_COMMUNICATION_NOTICES_API as __SUPERADMIN_COMMUNICATION_NOTICES_API } from "@/app/frontend_superadmin/superadmin_communication/communication_notices/config/superadmin_communication_notices.url_config";
import { SUPERADMIN_COMMUNICATION_NOTICES_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/api/superadmin_communication_notices.query_keys';

import { SUPERADMIN_COMMUNICATION_NOTICES_ERROR_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/mocks/handlers/SuperadminCommunicationNoticesErrorMockHandlers';
import { SUPERADMIN_COMMUNICATION_NOTICES_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/mocks/handlers/SuperadminCommunicationNoticesMockHandlers';
import { COMMUNICATION_NOTICES_MOCK_SERVER, setupCommunicationNoticesMockServer } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/tests/harness/bootstrap';

setupCommunicationNoticesMockServer();

describe('communication_notices standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_COMMUNICATION_NOTICES_ROUTES.SUPERADMIN_COMMUNICATION_NOTICES_URLS.PAGE).toContain('/superadmin/superadmin_communication');
    expect(__SUPERADMIN_COMMUNICATION_NOTICES_ROUTES.SUPERADMIN_COMMUNICATION_NOTICES_URLS.SCREEN).toBe("/superadmin/superadmin_communication/communication_notices");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_COMMUNICATION_NOTICES_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_communication", "communication_notices"]);
  });
  it('serves a canonical success envelope for notices', async () => {
    COMMUNICATION_NOTICES_MOCK_SERVER.use(...SUPERADMIN_COMMUNICATION_NOTICES_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_COMMUNICATION_NOTICES_API.NOTICES_LIST}`);
    expect(response.status).toBe(200);
    const envelope = await response.json() as { success: boolean; message: string; data: unknown; requestId: string };
    expect(envelope).toMatchObject({ success: true, requestId: 'msw-superadmin-notices-list' });
    expect(envelope.message.length).toBeGreaterThan(0);
    expect(envelope.data).toBeDefined();
  });
  it('surfaces a service error for the verified NOTICES_LIST read contract', async () => {
    COMMUNICATION_NOTICES_MOCK_SERVER.use(...SUPERADMIN_COMMUNICATION_NOTICES_ERROR_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_COMMUNICATION_NOTICES_API.NOTICES_LIST}`);
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ success: false, message: 'Service temporarily unavailable', data: null, errorCode: 'COMMUNICATION.NOTICES.UNAVAILABLE', statusCode: 503, requestId: 'msw-service-unavailable' });
  });
});

describe('canonical MSW scenario coverage', () => {
  it('returns an empty-data success envelope', async () => {
    COMMUNICATION_NOTICES_MOCK_SERVER.use(...SUPERADMIN_COMMUNICATION_NOTICES_EMPTY_DATA_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_COMMUNICATION_NOTICES_API.NOTICES_LIST}`);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true, data: [], meta: { total: 0, page: 1, limit: 1, totalPages: 0 } });
  });
  it('returns a canonical HTTP 500 envelope', async () => {
    COMMUNICATION_NOTICES_MOCK_SERVER.use(...SUPERADMIN_COMMUNICATION_NOTICES_SERVER_500_MSW_HANDLERS);
    const response = await fetch(`http://localhost${__SUPERADMIN_COMMUNICATION_NOTICES_API.NOTICES_LIST}`);
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({ success: false, data: null, statusCode: 500, errorCode: 'INTERNAL_SERVER_ERROR' });
  });
  it('returns canonical 401 and 403 envelopes', async () => {
    COMMUNICATION_NOTICES_MOCK_SERVER.use(...SUPERADMIN_COMMUNICATION_NOTICES_UNAUTHORIZED_401_MSW_HANDLERS);
    const unauthorized = await fetch(`http://localhost${__SUPERADMIN_COMMUNICATION_NOTICES_API.NOTICES_LIST}`);
    expect(unauthorized.status).toBe(401);
    await expect(unauthorized.json()).resolves.toMatchObject({ success: false, data: null, statusCode: 401, errorCode: 'AUTH.UNAUTHORIZED' });
    COMMUNICATION_NOTICES_MOCK_SERVER.use(...SUPERADMIN_COMMUNICATION_NOTICES_FORBIDDEN_403_MSW_HANDLERS);
    const forbidden = await fetch(`http://localhost${__SUPERADMIN_COMMUNICATION_NOTICES_API.NOTICES_LIST}`);
    expect(forbidden.status).toBe(403);
    await expect(forbidden.json()).resolves.toMatchObject({ success: false, data: null, statusCode: 403, errorCode: 'AUTH.FORBIDDEN' });
  });
  it('can abort a deliberately delayed network response', async () => {
    COMMUNICATION_NOTICES_MOCK_SERVER.use(...SUPERADMIN_COMMUNICATION_NOTICES_NETWORK_TIMEOUT_MSW_HANDLERS);
    await expect(fetch(`http://localhost${__SUPERADMIN_COMMUNICATION_NOTICES_API.NOTICES_LIST}`, { signal: AbortSignal.timeout(50) })).rejects.toThrow();
  });
});
