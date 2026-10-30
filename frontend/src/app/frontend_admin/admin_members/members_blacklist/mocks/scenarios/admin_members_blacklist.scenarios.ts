import type { AdminBlacklistRecord } from '@/app/frontend_admin/admin_members/members_blacklist/types/AdminMembersBlacklistTypes';
import type { z } from 'zod';
import { AdminBlacklistApiResponseSchema } from '@/app/frontend_admin/admin_members/members_blacklist/schemas/AdminMembersBlacklistSchema';

/**
 * Canonical transport-level mock scenario registry for Admin Members Blacklist.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminMembersBlacklistScenarioCatalog = (activeRecords: unknown) => ({
  ACTIVE_RECORDS: {
    kind: 'http-response',
    status: 200,
    envelope: {
      success: true,
      message: 'Module-local populated fixture.',
      data: activeRecords,
      requestId: 'mock-active-records',
    },
  },
  EMPTY_DATA: {
    kind: 'http-response',
    status: 200,
    envelope: {
      success: true,
      message: 'No records returned by the empty-result scenario.',
      data: [],
      requestId: 'mock-empty-data',
    },
  },
  SERVER_500_ERROR: {
    kind: 'http-response',
    status: 500,
    envelope: {
      success: false,
      message: 'Simulated internal server error.',
      data: null,
      errorCode: 'ERR_INTERNAL_500',
      statusCode: 500,
      requestId: 'mock-server-500',
    },
  },
  NETWORK_TIMEOUT: {
    kind: 'delayed-http-response',
    delayMs: 15000,
    status: 504,
    envelope: {
      success: false,
      message: 'Simulated request timeout.',
      data: null,
      errorCode: 'ERR_TIMEOUT',
      statusCode: 504,
      requestId: 'mock-network-timeout',
    },
  },
  UNAUTHORIZED_401: {
    kind: 'http-response',
    status: 401,
    envelope: {
      success: false,
      message: 'Simulated unauthenticated request.',
      data: null,
      errorCode: 'ERR_UNAUTHORIZED',
      statusCode: 401,
      requestId: 'mock-unauthorized-401',
    },
  },
  FORBIDDEN_403: {
    kind: 'http-response',
    status: 403,
    envelope: {
      success: false,
      message: 'Simulated authenticated request without permission.',
      data: null,
      errorCode: 'ERR_FORBIDDEN',
      statusCode: 403,
      requestId: 'mock-forbidden-403',
    },
  },
  NETWORK_ERROR: {
    kind: 'transport-error',
    transport: 'fetch-rejection',
    message: 'Simulated network failure without an HTTP response.',
  },
  INVALID_RESPONSE: {
    kind: 'malformed-success-envelope',
    status: 200,
    envelope: {
      success: true,
      message: 'Deliberately malformed response: required data and requestId are absent.',
    },
  },
} as const);

/** Synthetic rows for explicitly enabled development demo mode only. */
export const ADMIN_BLACKLIST_DEMO_FIXTURES: readonly AdminBlacklistRecord[] = [
  { id: 'demo-blacklist-001', name: 'Demo Student A', phone: '+91 90000 00001', reason: 'Repeated policy violations (demo)', blacklistedBy: 'Demo Admin', blacklistedOn: '2026-10-01', previousSeat: 'A-04', status: 'Blacklisted' },
  { id: 'demo-blacklist-002', name: 'Demo Student B', phone: '+91 90000 00002', reason: 'Unresolved account issue (demo)', blacklistedBy: 'Demo Admin', blacklistedOn: '2026-10-03', previousSeat: 'B-12', status: 'Blacklisted' },
];

/** Synthetic frontend response fixture for API-layer tests only. */
export const ADMIN_BLACKLIST_API_FIXTURE: z.infer<typeof AdminBlacklistApiResponseSchema> = [
  { id: 'BL-DEMO-001', name: 'Demo Student A', phone: '+91 90000 00001', reason: 'Synthetic test reason', blacklistedBy: 'Demo Admin', blacklistedOn: '2026-10-01', previousSeat: 'A-04' },
];

/** No API path is registered: the backend contract for members_blacklist is CONTRACT_MISSING. */
export const ADMIN_BLACKLIST_MSW_HANDLERS = [] as const;
