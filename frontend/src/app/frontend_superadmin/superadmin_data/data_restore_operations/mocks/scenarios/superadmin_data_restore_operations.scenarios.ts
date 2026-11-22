// frontend/src/app/frontend_superadmin/superadmin_data/data_restore_operations/mocks/scenarios/superadmin_data_restore_operations.scenarios.ts
/**
 * @file superadmin_data_restore_operations.scenarios.ts
 * @description Mock scenarios for testing edge cases, empty state, errors, and success paths.
 */

import { MOCK_SNAPSHOTS, MOCK_DRILL_HISTORY, MOCK_RESTORE_OVERVIEW } from '../fixtures/superadmin_data_restore_operations.fixtures';

export const restoreScenarios = {
  default: {
    overview: MOCK_RESTORE_OVERVIEW,
    snapshots: MOCK_SNAPSHOTS,
    drills: MOCK_DRILL_HISTORY,
  },
  empty: {
    overview: {
      totalSnapshots: 0,
      verifiedSnapshots: 0,
      lastDrillResult: {
        status: 'SCHEDULED' as const,
        simulatedRtoMinutes: 0,
        executedAt: new Date().toISOString(),
      },
      tenantIsolationGuarantee: true,
    },
    snapshots: [],
    drills: [],
  },
  failedDrill: {
    overview: {
      ...MOCK_RESTORE_OVERVIEW,
      lastDrillResult: {
        status: 'FAILED' as const,
        simulatedRtoMinutes: 45.2,
        executedAt: '2026-11-20T01:00:00.000Z',
      },
    },
    snapshots: MOCK_SNAPSHOTS,
    drills: [
      {
        id: 'drill-failed',
        snapshotId: 'snp-001',
        snapshotNumber: 'SNP-2026-11-20-001',
        executedAt: '2026-11-20T01:00:00.000Z',
        durationSeconds: 2712,
        status: 'FAILED' as const,
        simulatedRtoMinutes: 45.2,
        checksumMatch: false,
        tenantIsolationPass: false,
        notes: 'Checksum mismatch during disk extraction: target schema drift detected.',
        operatorId: 'system.dr-automation@platform',
      },
    ],
  },
};
