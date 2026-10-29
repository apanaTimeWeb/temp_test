import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { MANAGER_COMMUNICATION_NOTICES_URL } from '@/app/frontend_manager/manager_communication/communication_notices/config/manager_communication_notices.url_config';
import { managerNoticesHandlers } from '@/app/frontend_manager/manager_communication/communication_notices/mocks/manager_communication_notices_handlers/ManagerCommunicationNoticesHandlers';
import { managerNoticesNoticeResponseListSchema } from '@/app/frontend_manager/manager_communication/communication_notices/schemas/ManagerCommunicationNoticesSchema';

const server = setupServer(...managerNoticesHandlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('manager notices isolated GET contract', () => {
  it('returns an ApiResponse envelope containing schema-valid notices and an empty list', async () => {
    const populatedResponse = await fetch(`http://localhost${MANAGER_COMMUNICATION_NOTICES_URL}`);
    const emptyResponse = await fetch(`http://localhost${MANAGER_COMMUNICATION_NOTICES_URL}?__testMode=empty`);
    const populated = await populatedResponse.json();
    const empty = await emptyResponse.json();

    expect(populated.success).toBe(true);
    expect(populated.requestId).toEqual(expect.any(String));
    expect(managerNoticesNoticeResponseListSchema.parse(populated.data)).toHaveLength(4);
    expect(empty.success).toBe(true);
    expect(managerNoticesNoticeResponseListSchema.parse(empty.data)).toEqual([]);
  });

  it('returns the canonical failure envelope for retryable errors and validates ISO dates', async () => {
    const response = await fetch(`http://localhost${MANAGER_COMMUNICATION_NOTICES_URL}?__testMode=error`);
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body).toMatchObject({ success: false, data: null, errorCode: 'SYNTHETIC_TEST_ERROR', statusCode: 503 });
    expect(managerNoticesNoticeResponseListSchema.safeParse([{ id: 'x', title: 't', message: 'm', createdAt: '2026-02-30', validTill: '2026-03-01' }]).success).toBe(false);
  });
});
