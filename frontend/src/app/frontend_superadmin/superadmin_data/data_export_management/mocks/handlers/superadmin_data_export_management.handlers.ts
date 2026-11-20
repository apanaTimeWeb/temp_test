// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/mocks/handlers/superadmin_data_export_management.handlers.ts
/**
 * @file superadmin_data_export_management.handlers.ts
 * @description MSW-compatible REST API handlers for Data Export Management.
 */

import { EXPORT_MANAGEMENT_URLS } from '../../config/superadmin_data_export_management.url_config';
import {
  MOCK_EXPORT_OVERVIEW,
  MOCK_EXPORT_JOBS,
  MOCK_EXPORT_TENANTS,
  MOCK_EXPORT_BRANCHES,
} from '../fixtures/superadmin_data_export_management.fixtures';

export const mockExportHandlers = [
  {
    path: EXPORT_MANAGEMENT_URLS.OVERVIEW,
    method: 'GET',
    handler: () => ({ status: 200, data: MOCK_EXPORT_OVERVIEW }),
  },
  {
    path: EXPORT_MANAGEMENT_URLS.JOBS_LIST,
    method: 'GET',
    handler: () => ({ status: 200, data: MOCK_EXPORT_JOBS }),
  },
  {
    path: EXPORT_MANAGEMENT_URLS.TENANTS_LIST,
    method: 'GET',
    handler: () => ({ status: 200, data: MOCK_EXPORT_TENANTS }),
  },
  {
    path: EXPORT_MANAGEMENT_URLS.BRANCHES_LIST,
    method: 'GET',
    handler: () => ({ status: 200, data: MOCK_EXPORT_BRANCHES }),
  },
  {
    path: EXPORT_MANAGEMENT_URLS.TRIGGER_EXPORT,
    method: 'POST',
    handler: (body: unknown) => ({
      status: 200,
      data: {
        id: 'exp-job-' + Date.now(),
        exportNumber: 'EXP-2026-LIVE',
        scope: (body as { scope: string })?.scope ?? 'TENANT',
        tenantId: (body as { tenantId: string })?.tenantId ?? 'tnt-delhi-central',
        tenantName: 'Delhi Central Library',
        format: 'ENCRYPTED_ZIP',
        entities: ['catalogs', 'patrons'],
        sizeBytes: null,
        sha256Checksum: null,
        downloadUrl: null,
        status: 'QUEUED',
        progressPercent: 0,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        requestedBy: 'superadmin@institution.edu',
      },
    }),
  },
];
