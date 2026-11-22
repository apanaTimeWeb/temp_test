// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/mocks/handlers/superadmin_data_restore_operations.handlers.ts
/**
 * @file superadmin_data_restore_operations.handlers.ts
 * @description MSW-compatible REST API handlers for Restore Operations.
 */

import { RESTORE_OPERATIONS_URLS } from '../../config/superadmin_data_restore_operations.url_config';
import {
  MOCK_SNAPSHOTS,
  MOCK_DRILL_HISTORY,
  MOCK_RESTORE_OVERVIEW,
} from '../fixtures/superadmin_data_restore_operations.fixtures';

export const mockRestoreHandlers = [
  {
    path: RESTORE_OPERATIONS_URLS.OVERVIEW,
    method: 'GET',
    handler: () => ({ status: 200, data: MOCK_RESTORE_OVERVIEW }),
  },
  {
    path: RESTORE_OPERATIONS_URLS.SNAPSHOTS_LIST,
    method: 'GET',
    handler: () => ({ status: 200, data: MOCK_SNAPSHOTS }),
  },
  {
    path: RESTORE_OPERATIONS_URLS.DRILLS_LIST,
    method: 'GET',
    handler: () => ({ status: 200, data: MOCK_DRILL_HISTORY }),
  },
  {
    path: RESTORE_OPERATIONS_URLS.EXECUTE_RESTORE,
    method: 'POST',
    handler: (body: unknown) => ({
      status: 200,
      data: {
        restoreJobId: 'rst-job-' + Date.now(),
        snapshotId: (body as { snapshotId: string })?.snapshotId ?? 'snp-001',
        status: 'QUEUED',
        startedAt: new Date().toISOString(),
        estimatedCompletionAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        sandboxIsolationVerified: true,
        auditLogId: 'audit-rst-' + Date.now(),
      },
    }),
  },
  {
    path: RESTORE_OPERATIONS_URLS.TRIGGER_DRILL,
    method: 'POST',
    handler: () => ({
      status: 200,
      data: {
        id: 'drill-new',
        snapshotId: 'snp-001',
        snapshotNumber: 'SNP-2026-11-20-001',
        executedAt: new Date().toISOString(),
        durationSeconds: 120,
        status: 'PASSED',
        simulatedRtoMinutes: 2.0,
        checksumMatch: true,
        tenantIsolationPass: true,
        notes: 'Sandbox drill completed successfully.',
        operatorId: 'superadmin.ops@platform',
      },
    }),
  },
];
