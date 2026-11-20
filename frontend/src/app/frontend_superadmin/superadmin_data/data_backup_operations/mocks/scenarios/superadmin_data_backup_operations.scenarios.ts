// mocks/scenarios/superadmin_data_backup_operations.scenarios.ts
import { MOCK_SUPERADMIN_BACKUP_SCHEDULES } from '@/app/frontend_superadmin/superadmin_data/data_backup_operations/mocks/fixtures/superadmin_data_backup_operations.fixtures';

export const SUPERADMIN_DATA_BACKUP_OPERATIONS_SCENARIOS = {
  ACTIVE: {
    status: 200,
    envelope: {
      success: true,
      message: 'Schedules fetched successfully',
      data: MOCK_SUPERADMIN_BACKUP_SCHEDULES,
      requestId: 'req-sched-001',
    },
  },
  EMPTY: {
    status: 200,
    envelope: {
      success: true,
      message: 'No backup schedules configured',
      data: [],
      requestId: 'req-sched-emp',
    },
  },
  SERVER_500: {
    status: 500,
    envelope: {
      success: false,
      message: 'Backup scheduler daemon error',
      data: null,
      errorCode: 'ERR_SCHED_500',
      statusCode: 500,
      requestId: 'req-sched-err',
    },
  },
  TIMEOUT: {
    status: 504,
    envelope: {
      success: false,
      message: 'Gateway timeout contacting backup worker pool',
      data: null,
      errorCode: 'ERR_SCHED_504',
      statusCode: 504,
      requestId: 'req-sched-timeout',
    },
  },
  UNAUTHORIZED: {
    status: 401,
    envelope: {
      success: false,
      message: 'Superadmin session expired',
      data: null,
      errorCode: 'ERR_UNAUTH',
      statusCode: 401,
      requestId: 'req-sched-unauth',
    },
  },
} as const;
