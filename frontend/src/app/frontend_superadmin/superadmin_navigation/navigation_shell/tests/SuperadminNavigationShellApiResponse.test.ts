// RESPONSIBILITY: Define source-level test coverage for navigation shell using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_navigation/navigation_shell/tests/SuperadminNavigationShellApiResponse.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import {
  parseSuperadminNavigationShellApiResponse,
  SuperadminNavigationShellApiFailureError,
} from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/utils/SuperadminNavigationShellApiResponse';

/** Contract regression coverage for the API gateway's success/failure discriminated union. */
describe('SuperadminNavigationShellApiResponse', () => {
  it('validates the success envelope before parsing the feature payload', () => {
    const result = parseSuperadminNavigationShellApiResponse(
      {
        success: true,
        message: 'Loaded records',
        data: [{ id: 'record-1' }],
        requestId: 'req-123',
        meta: { total: 1, page: 1, limit: 20, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      },
      (data) => {
        if (!Array.isArray(data)) throw new Error('Expected record array.');
        return data.map((row) => {
          if (typeof row !== 'object' || row === null || !('id' in row) || typeof row.id !== 'string') {
            throw new Error('Invalid record shape.');
          }
          return { id: row.id };
        });
      },
    );

    expect(result).toEqual([{ id: 'record-1' }]);
  });

  it('throws the typed failure without exposing the raw response object', () => {
    const response = {
      success: false,
      message: 'Permission denied',
      data: null,
      error: 'FORBIDDEN',
      errorCode: 'ACCESS.DENIED',
      statusCode: 403,
      requestId: 'req-403',
    };

    try {
      parseSuperadminNavigationShellApiResponse(response, (data) => data);
      throw new Error('Expected the API failure to throw.');
    } catch (error) {
      expect(error).toBeInstanceOf(SuperadminNavigationShellApiFailureError);
      expect(error).toMatchObject({ message: 'Permission denied', errorCode: 'ACCESS.DENIED', statusCode: 403, requestId: 'req-403' });
      expect(error).not.toHaveProperty('response');
    }
  });

  it('rejects success envelopes with a null payload', () => {
    expect(() => parseSuperadminNavigationShellApiResponse(
      { success: true, message: 'Invalid', data: null, requestId: 'req-null' },
      (data) => data,
    )).toThrow('API success response does not match the documented gateway envelope.');
  });

  it('rejects pagination metadata that violates the canonical contract', () => {
    expect(() => parseSuperadminNavigationShellApiResponse(
      { success: true, message: 'Loaded', data: [], requestId: 'req-meta', meta: { total: 3, page: 1, limit: 2, totalPages: 1, hasNextPage: true, hasPrevPage: false } },
      (data) => data,
    )).toThrow('API pagination metadata does not match the documented gateway envelope.');
  });
});
