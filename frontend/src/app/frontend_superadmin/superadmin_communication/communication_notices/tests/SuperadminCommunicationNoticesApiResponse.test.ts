// RESPONSIBILITY: Define source-level test coverage for communication notices using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_communication/communication_notices/tests/SuperadminCommunicationNoticesApiResponse.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { parseSuperadminCommunicationNoticesApiResponse, SuperadminCommunicationNoticesApiFailureError } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/utils/SuperadminCommunicationNoticesApiResponse';

/** Contract regression tests for the leaf-owned portable copy of the canonical API envelope. */
describe('SuperadminCommunicationNoticesApiResponse', () => {
  it('parses a valid success envelope before returning feature data', () => {
    const data = parseSuperadminCommunicationNoticesApiResponse(
      { success: true, message: 'Loaded', data: [{ id: 'row-1' }], requestId: 'req-success', meta: { total: 1, page: 1, limit: 20, totalPages: 1, hasNextPage: false, hasPrevPage: false } },
      (payload) => payload,
    );
    expect(data).toEqual([{ id: 'row-1' }]);
  });

  it('throws a typed error for the canonical failure envelope', () => {
    expect(() => parseSuperadminCommunicationNoticesApiResponse(
      { success: false, message: 'Denied', data: null, errorCode: 'ACCESS.DENIED', statusCode: 403, requestId: 'req-denied' },
      (payload) => payload,
    )).toThrow(SuperadminCommunicationNoticesApiFailureError);
  });

  it('rejects null success payloads and inconsistent pagination metadata', () => {
    expect(() => parseSuperadminCommunicationNoticesApiResponse({ success: true, message: 'Invalid', data: null, requestId: 'req-null' }, (payload) => payload))
      .toThrow('API success response does not match the documented gateway envelope.');
    expect(() => parseSuperadminCommunicationNoticesApiResponse(
      { success: true, message: 'Invalid metadata', data: [], requestId: 'req-meta', meta: { total: 3, page: 1, limit: 2, totalPages: 1, hasNextPage: true, hasPrevPage: false } },
      (payload) => payload,
    )).toThrow('API pagination metadata does not match the documented gateway envelope.');
  });
});
