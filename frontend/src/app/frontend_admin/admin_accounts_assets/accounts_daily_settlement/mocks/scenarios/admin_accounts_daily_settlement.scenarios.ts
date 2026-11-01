// mocks/scenarios/admin_accounts_daily_settlement.scenarios.ts
import {
  ADMIN_DAILY_SETTLEMENT_FIXTURES,
  ADMIN_DAILY_SETTLEMENT_KPI_FIXTURES,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/mocks/fixtures/admin_accounts_daily_settlement.fixtures';
import type {
  DailySettlementRecord,
  DailySettlementKpiSummary,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';

export interface AdminDailySettlementScenarioState {
  records: DailySettlementRecord[];
  kpis: DailySettlementKpiSummary;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

export const ADMIN_DAILY_SETTLEMENT_SCENARIOS = {
  ACTIVE: {
    records: ADMIN_DAILY_SETTLEMENT_FIXTURES,
    kpis: ADMIN_DAILY_SETTLEMENT_KPI_FIXTURES,
    isLoading: false,
    isError: false,
  },
  EMPTY: {
    records: [],
    kpis: {
      expectedCashToday: 0,
      clearedCashToday: 0,
      pendingHandoverAmount: 0,
      discrepancyShortageAmount: 0,
      totalPendingCount: 0,
      totalFlaggedCount: 0,
    },
    isLoading: false,
    isError: false,
  },
  SERVER_500: {
    records: [],
    kpis: {
      expectedCashToday: 0,
      clearedCashToday: 0,
      pendingHandoverAmount: 0,
      discrepancyShortageAmount: 0,
      totalPendingCount: 0,
      totalFlaggedCount: 0,
    },
    isLoading: false,
    isError: true,
    errorMessage: 'Internal Server Error (500): Settlement reconciliation service unavailable.',
  },
  TIMEOUT: {
    records: [],
    kpis: {
      expectedCashToday: 0,
      clearedCashToday: 0,
      pendingHandoverAmount: 0,
      discrepancyShortageAmount: 0,
      totalPendingCount: 0,
      totalFlaggedCount: 0,
    },
    isLoading: false,
    isError: true,
    errorMessage: 'Gateway Timeout (504): Handover audit report took too long to respond.',
  },
  UNAUTHORIZED: {
    records: [],
    kpis: {
      expectedCashToday: 0,
      clearedCashToday: 0,
      pendingHandoverAmount: 0,
      discrepancyShortageAmount: 0,
      totalPendingCount: 0,
      totalFlaggedCount: 0,
    },
    isLoading: false,
    isError: true,
    errorMessage: 'Forbidden (403): You do not have SuperAdmin permission to audit or clear settlements.',
  },
} as const satisfies Record<string, AdminDailySettlementScenarioState>;

