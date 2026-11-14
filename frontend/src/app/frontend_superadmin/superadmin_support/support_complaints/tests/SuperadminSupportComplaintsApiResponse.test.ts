// RESPONSIBILITY: Define source-level test coverage for support complaints using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_support/support_complaints/tests/SuperadminSupportComplaintsApiResponse.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { parseSuperadminSupportComplaintsApiResponse, SuperadminSupportComplaintsApiFailureError } from '@/app/frontend_superadmin/superadmin_support/support_complaints/utils/SuperadminSupportComplaintsApiResponse';
import { mapSuperadminSupportComplaintResponse } from '@/app/frontend_superadmin/superadmin_support/support_complaints/utils/SuperadminSupportComplaintsComplaintMapper';
import { formatSuperadminSupportComplaintDate } from '@/app/frontend_superadmin/superadmin_support/support_complaints/utils/SuperadminSupportComplaintsDateFormatter';
import { SUPERADMIN_SUPPORT_COMPLAINT_STATUS, SUPERADMIN_SUPPORT_COMPLAINT_STATUS_FILTERS } from '@/app/frontend_superadmin/superadmin_support/support_complaints/constants/SuperadminSupportComplaintsStaticConstants';

/** Contract regression tests for the leaf-owned portable copy of the canonical API envelope. */
describe('SuperadminSupportComplaintsApiResponse', () => {
  it('parses a valid success envelope before returning feature data', () => {
    const data = parseSuperadminSupportComplaintsApiResponse(
      { success: true, message: 'Loaded', data: [{ id: 'row-1' }], requestId: 'req-success', meta: { total: 1, page: 1, limit: 20, totalPages: 1, hasNextPage: false, hasPrevPage: false } },
      (payload) => payload,
    );
    expect(data).toEqual([{ id: 'row-1' }]);
  });

  it('throws a typed error for the canonical failure envelope', () => {
    expect(() => parseSuperadminSupportComplaintsApiResponse(
      { success: false, message: 'Denied', data: null, errorCode: 'ACCESS.DENIED', statusCode: 403, requestId: 'req-denied' },
      (payload) => payload,
    )).toThrow(SuperadminSupportComplaintsApiFailureError);
  });

  it('rejects null success payloads and inconsistent pagination metadata', () => {
    expect(() => parseSuperadminSupportComplaintsApiResponse({ success: true, message: 'Invalid', data: null, requestId: 'req-null' }, (payload) => payload))
      .toThrow('API success response does not match the documented gateway envelope.');
    expect(() => parseSuperadminSupportComplaintsApiResponse(
      { success: true, message: 'Invalid metadata', data: [], requestId: 'req-meta', meta: { total: 3, page: 1, limit: 2, totalPages: 1, hasNextPage: true, hasPrevPage: false } },
      (payload) => payload,
    )).toThrow('API pagination metadata does not match the documented gateway envelope.');
  });
});


describe('complaint privacy, status and date presentation contracts', () => {
  it('redacts the supplied student identity at the API mapping boundary for anonymous complaints', () => {
    const anonymous = mapSuperadminSupportComplaintResponse({ id: 'row-1', student: 'Private Student Name', isAnonymous: true, status: 'Open' });
    expect(anonymous).toMatchObject({ student: '', isAnonymous: true, status: SUPERADMIN_SUPPORT_COMPLAINT_STATUS.OPEN });
    const named = mapSuperadminSupportComplaintResponse({ id: 'row-2', student: 'Named Student', isAnonymous: false, status: 'in_progress' });
    expect(named).toMatchObject({ student: 'Named Student', isAnonymous: false, status: SUPERADMIN_SUPPORT_COMPLAINT_STATUS.IN_PROGRESS });
    const missingPrivacyFlag = mapSuperadminSupportComplaintResponse({ id: 'row-3', student: 'Unclassified Student' });
    expect(missingPrivacyFlag).toMatchObject({ student: '', isAnonymous: true });
    const invalidCalendarDate = mapSuperadminSupportComplaintResponse({ id: 'row-4', createdAt: '2026-02-31', isAnonymous: false });
    expect(invalidCalendarDate.date).toBe('');
  });

  it('keeps a single canonical status registry and filter list', () => {
    expect(Object.values(SUPERADMIN_SUPPORT_COMPLAINT_STATUS)).toEqual(['Open', 'In-Progress', 'Resolved', 'Unknown']);
    expect(SUPERADMIN_SUPPORT_COMPLAINT_STATUS_FILTERS).toEqual(['All', 'Open', 'In-Progress', 'Resolved']);
    expect(mapSuperadminSupportComplaintResponse({ id: 'row-3', status: 'unrecognized' }).status).toBe(SUPERADMIN_SUPPORT_COMPLAINT_STATUS.UNKNOWN);
  });

  it('formats date-only values with the active locale and rejects malformed calendar dates', () => {
    expect(formatSuperadminSupportComplaintDate('2026-04-10', 'en')).not.toBe('');
    expect(formatSuperadminSupportComplaintDate('2026-04-10', 'hi')).not.toBe(formatSuperadminSupportComplaintDate('2026-04-10', 'en'));
    expect(formatSuperadminSupportComplaintDate('2026-02-31', 'en')).toBe('');
  });
});
