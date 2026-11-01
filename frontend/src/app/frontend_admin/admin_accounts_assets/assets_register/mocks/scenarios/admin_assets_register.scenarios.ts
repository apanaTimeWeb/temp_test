// mocks/scenarios/admin_assets_register.scenarios.ts
import {
  ADMIN_ASSET_REGISTER_FIXTURES,
  ADMIN_ASSET_REGISTER_KPI_FIXTURES,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/mocks/fixtures/admin_assets_register.fixtures';
import type {
  AdminAssetRecord,
  AdminAssetsRegisterKpiSummary,
} from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';

export interface AdminAssetsRegisterScenarioState {
  records: AdminAssetRecord[];
  kpis: AdminAssetsRegisterKpiSummary;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

export const ADMIN_ASSET_REGISTER_SCENARIOS = {
  ACTIVE: {
    records: ADMIN_ASSET_REGISTER_FIXTURES,
    kpis: ADMIN_ASSET_REGISTER_KPI_FIXTURES,
    isLoading: false,
    isError: false,
  },
  EMPTY: {
    records: [],
    kpis: {
      totalAssetsCount: 0,
      totalCapExValue: 0,
      activeAmcCount: 0,
      warrantyExpiringSoonCount: 0,
      underRepairCount: 0,
    },
    isLoading: false,
    isError: false,
  },
  SERVER_500: {
    records: [],
    kpis: {
      totalAssetsCount: 0,
      totalCapExValue: 0,
      activeAmcCount: 0,
      warrantyExpiringSoonCount: 0,
      underRepairCount: 0,
    },
    isLoading: false,
    isError: true,
    errorMessage: 'Internal Server Error (500): Asset management service unavailable.',
  },
  TIMEOUT: {
    records: [],
    kpis: {
      totalAssetsCount: 0,
      totalCapExValue: 0,
      activeAmcCount: 0,
      warrantyExpiringSoonCount: 0,
      underRepairCount: 0,
    },
    isLoading: false,
    isError: true,
    errorMessage: 'Gateway Timeout (504): Asset register lookup timed out.',
  },
  UNAUTHORIZED: {
    records: [],
    kpis: {
      totalAssetsCount: 0,
      totalCapExValue: 0,
      activeAmcCount: 0,
      warrantyExpiringSoonCount: 0,
      underRepairCount: 0,
    },
    isLoading: false,
    isError: true,
    errorMessage: 'Forbidden (403): You do not have SuperAdmin permission to govern capital assets.',
  },
} as const satisfies Record<string, AdminAssetsRegisterScenarioState>;

