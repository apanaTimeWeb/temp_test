// DATA FLOW: accounts_daily_settlement route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';

import { useState } from 'react';
import { format, startOfToday } from 'date-fns';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_ACCOUNTS_DAILY_SETTLEMENT_FIXTURES } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/mocks/AdminAccountsDailySettlementFixtures';
import type { AdminAccountsDailySettlementEntry } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';

export const getDefaultSettlementDate = () => isFrontendDemoModeEnabled()
  ? (ADMIN_ACCOUNTS_DAILY_SETTLEMENT_FIXTURES[0]?.date ?? format(startOfToday(), 'yyyy-MM-dd'))
  : format(startOfToday(), 'yyyy-MM-dd');

export default function useAdminAccountsDailySettlementState() {
  const [date, setDate] = useState(getDefaultSettlementDate);
  const [entries, setEntries] = useState<AdminAccountsDailySettlementEntry[]>(() => isFrontendDemoModeEnabled() ? [...ADMIN_ACCOUNTS_DAILY_SETTLEMENT_FIXTURES] : []);
  const resetDate = () => setDate(getDefaultSettlementDate());
  return { date, setDate, resetDate, entries, setEntries } as const;
}
