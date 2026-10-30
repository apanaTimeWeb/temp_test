import { http, HttpResponse } from 'msw';
import { ADMIN_ASSETS_REGISTER_API } from '@/app/frontend_admin/admin_accounts_assets/assets_register/config/admin_assets_register.url_config';
import type { AdminAssetsRegisterAsset } from '@/app/frontend_admin/admin_accounts_assets/assets_register/schemas/AdminAssetsRegisterFormSchemas';

/**
 * Canonical transport-level mock scenario registry for Admin Assets Register.
 *
 * Pass a real module-local populated fixture as `activeRecords`; the registry does not invent
 * business records, endpoints, permission rules, or DTOs. The returned values are scenario
 * descriptors/envelopes for a module-owned test adapter. They are not wired to production APIs.
 */
export const createAdminAssetsRegisterScenarioCatalog = (activeRecords: unknown) => ({
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

/** Test-only handler for the source-observed generic accounting list path; its empty data is not an asset DTO claim. */
export const ADMIN_ASSETS_REGISTER_MSW_HANDLERS = [
  http.get(ADMIN_ASSETS_REGISTER_API.list, () => HttpResponse.json({
    success: true, message: 'List fixture returned no records.', data: ADMIN_ASSETS_REGISTER_API_FIXTURE, requestId: 'mock-assets-register-list',
  })),
];

export const ADMIN_ASSETS_REGISTER_ASSET_FIXTURES: readonly AdminAssetsRegisterAsset[] = [
  { id: 1, name: 'AC Unit — Hall A', category: 'Appliance', purchaseDate: '2023-06-01', purchaseValue: 4500000, currentValue: 3200000, location: 'Ground Floor', status: 'active' },
  { id: 2, name: 'CCTV Camera Set (8)', category: 'Security', purchaseDate: '2022-11-15', purchaseValue: 2800000, currentValue: 1800000, location: 'All Floors', status: 'active' },
  { id: 3, name: 'Water Purifier', category: 'Appliance', purchaseDate: '2024-01-10', purchaseValue: 1200000, currentValue: 1000000, location: 'Ground Floor', status: 'maintenance' },
  { id: 4, name: 'Study Tables (20)', category: 'Furniture', purchaseDate: '2021-08-20', purchaseValue: 6000000, currentValue: 3500000, location: 'First Floor', status: 'active' },
  { id: 5, name: 'Biometric Scanner', category: 'Security', purchaseDate: '2023-03-05', purchaseValue: 850000, currentValue: 600000, location: 'Entrance', status: 'active' },
  { id: 6, name: 'Old Printer', category: 'Electronics', purchaseDate: '2020-05-12', purchaseValue: 1500000, currentValue: 0, location: 'Store Room', status: 'disposed' },
];

/** Empty response fixture only: no asset API DTO is inferred from the generic accounting endpoint. */
export const ADMIN_ASSETS_REGISTER_API_FIXTURE: readonly [] = [];
