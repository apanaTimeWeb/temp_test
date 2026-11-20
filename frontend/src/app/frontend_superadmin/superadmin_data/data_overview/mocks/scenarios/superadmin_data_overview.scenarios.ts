// mocks/scenarios/superadmin_data_overview.scenarios.ts
// Scenario registry covering ACTIVE, EMPTY, SERVER_500, TIMEOUT, UNAUTHORIZED

import {
  MOCK_SUPERADMIN_DATA_OVERVIEW_METRICS,
  MOCK_SUPERADMIN_DATA_OVERVIEW_RPO_RTO,
  MOCK_SUPERADMIN_DATA_OVERVIEW_ACTIVITIES,
  MOCK_SUPERADMIN_DATA_OVERVIEW_STORAGE,
} from '@/app/frontend_superadmin/superadmin_data/data_overview/mocks/fixtures/superadmin_data_overview.fixtures';

export const SUPERADMIN_DATA_OVERVIEW_SCENARIOS = {
  ACTIVE: {
    status: 200,
    metrics: {
      success: true,
      message: 'Metrics fetched successfully',
      data: MOCK_SUPERADMIN_DATA_OVERVIEW_METRICS,
      requestId: 'req-ovw-act-001',
    },
    rpoRto: {
      success: true,
      message: 'RPO/RTO status fetched successfully',
      data: MOCK_SUPERADMIN_DATA_OVERVIEW_RPO_RTO,
      requestId: 'req-ovw-rpo-001',
    },
    activity: {
      success: true,
      message: 'Recent activity fetched successfully',
      data: MOCK_SUPERADMIN_DATA_OVERVIEW_ACTIVITIES,
      requestId: 'req-ovw-act-002',
    },
    storage: {
      success: true,
      message: 'Storage breakdown fetched successfully',
      data: MOCK_SUPERADMIN_DATA_OVERVIEW_STORAGE,
      requestId: 'req-ovw-str-001',
    },
  },
  EMPTY: {
    status: 200,
    metrics: {
      success: true,
      message: 'Metrics fetched',
      data: {
        platformDrScore: 0,
        activeSchedulesCount: 0,
        totalSnapshotsCount: 0,
        totalStorageUsedGb: 0,
        storageQuotaGb: 1000,
        lastBackupTimestamp: 'None recorded',
        lastRestoreDrillTimestamp: 'None recorded',
        replicationHealth: 'DEGRADED' as const,
        tenantIsolationIntegrity: 'ATTENTION_REQUIRED' as const,
      },
      requestId: 'req-ovw-emp-001',
    },
    rpoRto: {
      success: true,
      message: 'RPO/RTO status fetched',
      data: {
        targetRpoMinutes: 15,
        currentRpoMinutes: 0,
        rpoStatus: 'BREACHED' as const,
        targetRtoMinutes: 30,
        testedRtoMinutes: 0,
        rtoStatus: 'BREACHED' as const,
        lastDrillPassRate: 0,
        nextScheduledDrill: 'Not scheduled',
      },
      requestId: 'req-ovw-emp-002',
    },
    activity: {
      success: true,
      message: 'No activities found',
      data: [],
      requestId: 'req-ovw-emp-003',
    },
    storage: {
      success: true,
      message: 'Storage empty',
      data: [],
      requestId: 'req-ovw-emp-004',
    },
  },
  SERVER_500: {
    status: 500,
    envelope: {
      success: false,
      message: 'Disaster Recovery metrics service unavailable',
      data: null,
      errorCode: 'ERR_DATA_OVERVIEW_500',
      statusCode: 500,
      requestId: 'req-ovw-err-500',
    },
  },
  TIMEOUT: {
    status: 504,
    envelope: {
      success: false,
      message: 'Gateway timeout querying dual-region replication cluster',
      data: null,
      errorCode: 'ERR_DATA_OVERVIEW_504',
      statusCode: 504,
      requestId: 'req-ovw-err-504',
    },
  },
  UNAUTHORIZED: {
    status: 401,
    envelope: {
      success: false,
      message: 'Superadmin session expired or insufficient privileges',
      data: null,
      errorCode: 'ERR_UNAUTHORIZED_401',
      statusCode: 401,
      requestId: 'req-ovw-err-401',
    },
  },
} as const;
