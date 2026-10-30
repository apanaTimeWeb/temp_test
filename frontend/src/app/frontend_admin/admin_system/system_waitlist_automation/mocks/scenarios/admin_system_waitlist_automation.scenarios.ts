import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';

/**
 * Canonical transport-level mock scenario registry for Admin System Waitlist Automation.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminSystemWaitlistAutomationScenarioCatalog = (activeRecords: unknown) => ({
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

export interface AdminSystemWaitlistPreviewRecord {
  name: string;
  shift: string;
  position: number;
  avatar: string;
  joined: string;
}

/** Synthetic queue rows for the demo-only waitlist preview. */
export const ADMIN_SYSTEM_WAITLIST_PREVIEW_FIXTURES: readonly AdminSystemWaitlistPreviewRecord[] = [
  { name: 'Rahul Sharma', shift: 'Morning', position: 1, avatar: 'R', joined: '2026-04-08' },
  { name: 'Priya Verma', shift: 'Afternoon', position: 2, avatar: 'P', joined: '2026-04-09' },
  { name: 'Amit Kumar', shift: 'Evening', position: 3, avatar: 'A', joined: '2026-04-10' },
  { name: 'Sneha Patel', shift: 'Morning', position: 4, avatar: 'S', joined: '2026-04-10' },
  { name: 'Rohan Das', shift: 'Afternoon', position: 5, avatar: 'R', joined: '2026-04-11' },
];

/** Synthetic outbound message template for preview; it is never sent or persisted. */
export const ADMIN_SYSTEM_WAITLIST_PREVIEW_DEFAULT_TEMPLATE =
  `Hello {name}! 🎉 A seat (Shift: {shift}) is now available at ${ADMIN_BRAND_CONFIG.displayName}. Reply YES to confirm your booking within 30 minutes. — ${ADMIN_BRAND_CONFIG.displayName} Team`;
