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
  {
    id: 'demo-blacklist-001',
    name: 'Vikram Rajput',
    phone: '+91 90000 00001',
    reason: 'Caught stealing laptop charger and headphones from desk in Silent Study Hall A; security footage confirmed.',
    blacklistedBy: 'Chief Security Officer',
    blacklistedOn: '2026-10-01',
    previousSeat: 'A-04',
    status: 'Blacklisted',
    branch: 'Downtown Central',
    category: 'THEFT_STOLEN_PROPERTY',
    banScope: 'NETWORK_WIDE',
    banDuration: 'PERMANENT',
    incidentDate: '2026-09-30',
    incidentLocation: 'Reading Hall A - Desk 04',
    firRefNo: 'FIR-2026-SEC-092',
    revokedSeat: true,
    revokedLocker: true,
    blockedBiometric: true,
    confiscatedDeposit: true,
    incidentNotes: 'Biometric gate access revoked across all network branches. Caution deposit forfeited towards victim compensation.',
  },
  {
    id: 'demo-blacklist-002',
    name: 'Aman Verma',
    phone: '+91 90000 00002',
    reason: 'Physical altercation with desk manager and vandalism of reading cabin partition.',
    blacklistedBy: 'Admin Operations',
    blacklistedOn: '2026-10-03',
    previousSeat: 'B-12',
    status: 'Blacklisted',
    branch: 'Westside Branch',
    category: 'PHYSICAL_ALTERCATION',
    banScope: 'NETWORK_WIDE',
    banDuration: 'TEMPORARY_180_DAYS',
    banValidUntil: '2027-04-03',
    incidentDate: '2026-10-02',
    incidentLocation: 'Silent Floor 2',
    revokedSeat: true,
    revokedLocker: false,
    blockedBiometric: true,
    confiscatedDeposit: true,
    incidentNotes: '6 months network-wide suspension. Can apply for reinstatement post review and damage settlement.',
  },
  {
    id: 'demo-blacklist-003',
    name: 'Suresh Kumar',
    phone: '+91 90000 00003',
    reason: 'Repeated proxy attendance and illegal seat sharing with unauthorized outsiders.',
    blacklistedBy: 'Branch Supervisor',
    blacklistedOn: '2026-10-15',
    previousSeat: 'C-08',
    status: 'Blacklisted',
    branch: 'Downtown Central',
    category: 'UNAUTHORIZED_OCCUPANCY',
    banScope: 'BRANCH_SPECIFIC',
    banDuration: 'TEMPORARY_90_DAYS',
    banValidUntil: '2027-01-15',
    incidentDate: '2026-10-14',
    incidentLocation: 'Cubicle Hall C',
    revokedSeat: true,
    revokedLocker: false,
    blockedBiometric: true,
    confiscatedDeposit: false,
  },
];

/** Synthetic frontend response fixture for API-layer tests only. */
export const ADMIN_BLACKLIST_API_FIXTURE: z.infer<typeof AdminBlacklistApiResponseSchema> = [
  { id: 'BL-DEMO-001', name: 'Demo Student A', phone: '+91 90000 00001', reason: 'Synthetic test reason', blacklistedBy: 'Demo Admin', blacklistedOn: '2026-10-01', previousSeat: 'A-04' },
];

/** No API path is registered: the backend contract for members_blacklist is CONTRACT_MISSING. */
export const ADMIN_BLACKLIST_MSW_HANDLERS = [] as const;
