// api/admin_accounts_daily_settlement.query_keys.ts
import type { DailySettlementFilterParams } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';

export const ADMIN_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS = {
  all: ['admin_accounts_daily_settlement'] as const,
  lists: () => [...ADMIN_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS.all, 'list'] as const,
  list: (params?: DailySettlementFilterParams) => [...ADMIN_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS.lists(), params ?? {}] as const,
  details: () => [...ADMIN_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ADMIN_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS.details(), id] as const,
  kpis: () => [...ADMIN_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS.all, 'kpis'] as const,
};

