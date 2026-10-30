import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { ApiResponseError, parseApiResponseData } from '@/lib/apiSchema';

const RecordsSchema = z.array(z.object({ id: z.string() }));

 describe('parseApiResponseData', () => {
  it('validates the canonical envelope and feature-owned data schema', () => {
    expect(parseApiResponseData({ success: true, message: 'OK', data: [{ id: 'member-1' }], requestId: 'req-1' }, RecordsSchema))
      .toEqual([{ id: 'member-1' }]);
  });

  it('rejects a bare array instead of silently accepting a non-canonical envelope', () => {
    expect(() => parseApiResponseData([{ id: 'member-1' }], RecordsSchema)).toThrow();
  });

  it('rejects a malformed envelope and malformed data payload', () => {
    expect(() => parseApiResponseData({ success: true, data: [] }, RecordsSchema)).toThrow();
    expect(() => parseApiResponseData({ success: true, message: 'OK', data: [{ id: 1 }], requestId: 'req-2' }, RecordsSchema)).toThrow();
  });

  it('surfaces a canonical business error without parsing its null data', () => {
    expect(() => parseApiResponseData({ success: false, message: 'Permission denied', data: null, errorCode: 'AUTH_FORBIDDEN', statusCode: 403, requestId: 'req-3' }, RecordsSchema))
      .toThrowError(ApiResponseError);
    try {
      parseApiResponseData({ success: false, message: 'Permission denied', data: null, errorCode: 'AUTH_FORBIDDEN', statusCode: 403, requestId: 'req-3' }, RecordsSchema);
    } catch (error) {
      expect(error).toMatchObject({ message: 'Permission denied', statusCode: 403 });
    }
  });

  it('rejects a successful null payload when concrete data is required', () => {
    expect(() => parseApiResponseData({ success: true, message: 'OK', data: null, requestId: 'req-4' }, RecordsSchema)).toThrowError(ApiResponseError);
  });
});


describe('non-empty API error messages', () => {
  it('falls back when an error envelope message is blank or missing', () => {
    expect(() => parseApiResponseData({ success: false, message: '', data: null, errorCode: 'CONFLICT', statusCode: 409, requestId: 'req-5' }, z.unknown())).toThrow('Request failed (CONFLICT).');
    expect(() => parseApiResponseData({ success: false, message: '   ', data: null, errorCode: 'CONFLICT', statusCode: 409, requestId: 'req-6' }, z.unknown())).toThrow('Request failed (CONFLICT).');
    expect(() => parseApiResponseData({ success: false, message: '', data: null, errorCode: 'UNKNOWN', statusCode: 500, requestId: 'req-7' }, z.unknown())).toThrow('Request failed (UNKNOWN).');
  });
});


describe('canonical envelope metadata', () => {
  it('requires a request identifier on successful responses', () => {
    expect(parseApiResponseData({ success: true, message: 'OK', data: [{ id: 'member-1' }], requestId: 'req-123' }, RecordsSchema))
      .toEqual([{ id: 'member-1' }]);
    expect(() => parseApiResponseData({ success: true, message: 'OK', data: [{ id: 'member-1' }] }, RecordsSchema)).toThrow();
  });
});
