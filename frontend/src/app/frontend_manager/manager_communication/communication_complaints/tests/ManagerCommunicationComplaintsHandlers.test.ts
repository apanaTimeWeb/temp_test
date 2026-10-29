import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { setupServer } from 'msw/node';
import { MANAGER_COMMUNICATION_COMPLAINTS_URL } from '@/app/frontend_manager/manager_communication/communication_complaints/config/manager_communication_complaints.url_config';
import { managerComplaintsHandlers } from '@/app/frontend_manager/manager_communication/communication_complaints/mocks/manager_communication_complaints_handlers/ManagerCommunicationComplaintsHandlers';
import { managerComplaintsComplaintResponseListSchema } from '@/app/frontend_manager/manager_communication/communication_complaints/schemas/ManagerCommunicationComplaintsSchema';

const server = setupServer(...managerComplaintsHandlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('manager complaints isolated GET contract', () => {
  it('returns an ApiResponse envelope containing schema-valid complaints and an empty list', async () => {
    const populatedResponse = await fetch(`http://localhost${MANAGER_COMMUNICATION_COMPLAINTS_URL}`);
    const emptyResponse = await fetch(`http://localhost${MANAGER_COMMUNICATION_COMPLAINTS_URL}?__testMode=empty`);
    const populated = await populatedResponse.json();
    const empty = await emptyResponse.json();

    expect(populated.success).toBe(true);
    expect(populated.requestId).toEqual(expect.any(String));
    expect(managerComplaintsComplaintResponseListSchema.parse(populated.data)).toHaveLength(4);
    expect(empty.success).toBe(true);
    expect(managerComplaintsComplaintResponseListSchema.parse(empty.data)).toEqual([]);
  });

  it('returns the canonical failure envelope for retryable errors and rejects unknown statuses', async () => {
    const response = await fetch(`http://localhost${MANAGER_COMMUNICATION_COMPLAINTS_URL}?__testMode=error`);
    const body = await response.json();
    expect(response.status).toBe(503);
    expect(body).toMatchObject({ success: false, data: null, errorCode: 'SYNTHETIC_TEST_ERROR', statusCode: 503 });
    expect(managerComplaintsComplaintResponseListSchema.safeParse([{ id: 'x', subject: 's', description: 'd', createdAt: '2026-01-01', status: 'unknown' }]).success).toBe(false);
  });
});
