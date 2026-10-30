import type { AdminBranchesBranch } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';
import type { z } from 'zod';
import { AdminBranchesApiResponseSchema } from '@/app/frontend_admin/admin_settings/settings_branches/schemas/AdminSettingsBranchesSchema';
import { http, HttpResponse } from 'msw';
import { ADMIN_SETTINGS_BRANCHES_API } from '@/app/frontend_admin/admin_settings/settings_branches/config/admin_settings_branches.url_config';

/**
 * Canonical transport-level mock scenario registry for Admin Settings Branches.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminSettingsBranchesScenarioCatalog = (activeRecords: unknown) => ({
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

export const ADMIN_BRANCHES_FIXTURE_DATA: readonly AdminBranchesBranch[] = [
  { id: 'BR-001', name: 'Downtown Central', code: 'DT-CEN', address: '123 Main St, City', phone: '+91 9876543210', email: 'downtown@lib.com', manager: 'Vikram Singh', status: 'Active' },
  { id: 'BR-002', name: 'Westside Branch', code: 'WS-BR', address: '45 West Ave, City', phone: '+91 9876543211', email: 'westside@lib.com', manager: 'Anita Desai', status: 'Suspended' },
  { id: 'BR-003', name: 'North Hub', code: 'NH-01', address: '88 North Blvd, City', phone: '+91 9876543212', email: 'north@lib.com', manager: 'Rahul Sharma', status: 'Active' },
];

/** Synthetic frontend response fixture used only by API-layer tests. */
export const ADMIN_BRANCHES_API_FIXTURE: z.infer<typeof AdminBranchesApiResponseSchema> = [
  { id: 'BR-DEMO-001', name: 'Demo Central Branch', code: 'DEMO-CEN', address: 'Demo address only', phone: '+91 90000 00011', email: 'central@example.invalid', manager: 'Demo Manager', status: 'Active' },
];

/** Test-only frontend contract handler. */
export const ADMIN_BRANCHES_MSW_HANDLERS = [http.get(ADMIN_SETTINGS_BRANCHES_API.LIST, () => HttpResponse.json({ success: true, message: 'Synthetic branch fixture loaded.', data: ADMIN_BRANCHES_API_FIXTURE, requestId: 'mock-settings-branches-list' }))];
