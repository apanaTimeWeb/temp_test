// mocks/handlers/superadmin_data_overview.handlers.ts
// MSW handlers for Superadmin Data Overview

import { SUPERADMIN_DATA_OVERVIEW_API } from '@/app/frontend_superadmin/superadmin_data/data_overview/config/superadmin_data_overview.url_config';
import { SUPERADMIN_DATA_OVERVIEW_SCENARIOS } from '@/app/frontend_superadmin/superadmin_data/data_overview/mocks/scenarios/superadmin_data_overview.scenarios';

export interface MockRequestHandler {
  url: string;
  method: string;
  handle: (req?: unknown) => { status: number; body: unknown };
}

export const superadminDataOverviewMockHandlers: MockRequestHandler[] = [
  {
    url: SUPERADMIN_DATA_OVERVIEW_API.getOverviewMetrics,
    method: 'GET',
    handle: () => ({
      status: SUPERADMIN_DATA_OVERVIEW_SCENARIOS.ACTIVE.status,
      body: SUPERADMIN_DATA_OVERVIEW_SCENARIOS.ACTIVE.metrics,
    }),
  },
  {
    url: SUPERADMIN_DATA_OVERVIEW_API.getRpoRtoStatus,
    method: 'GET',
    handle: () => ({
      status: SUPERADMIN_DATA_OVERVIEW_SCENARIOS.ACTIVE.status,
      body: SUPERADMIN_DATA_OVERVIEW_SCENARIOS.ACTIVE.rpoRto,
    }),
  },
  {
    url: SUPERADMIN_DATA_OVERVIEW_API.getRecentActivity,
    method: 'GET',
    handle: () => ({
      status: SUPERADMIN_DATA_OVERVIEW_SCENARIOS.ACTIVE.status,
      body: SUPERADMIN_DATA_OVERVIEW_SCENARIOS.ACTIVE.activity,
    }),
  },
  {
    url: SUPERADMIN_DATA_OVERVIEW_API.getStorageBreakdown,
    method: 'GET',
    handle: () => ({
      status: SUPERADMIN_DATA_OVERVIEW_SCENARIOS.ACTIVE.status,
      body: SUPERADMIN_DATA_OVERVIEW_SCENARIOS.ACTIVE.storage,
    }),
  },
  {
    url: SUPERADMIN_DATA_OVERVIEW_API.triggerQuickBackup,
    method: 'POST',
    handle: () => ({
      status: 200,
      body: {
        success: true,
        message: 'On-demand snapshot triggered and queued for dual-region sync',
        data: { snapshotId: `snap-${Date.now()}`, status: 'IN_PROGRESS' },
        requestId: `req-snap-${Date.now()}`,
      },
    }),
  },
];
