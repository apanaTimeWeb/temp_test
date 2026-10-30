import type { AdminAccountsDailySettlementEntry } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';

/** Synthetic rows for the explicit demo-only settlement preview, stored in paise. */
export const ADMIN_ACCOUNTS_DAILY_SETTLEMENT_FIXTURES: readonly AdminAccountsDailySettlementEntry[] = [
  { id: 1, date: '2026-10-10', shift: 'Morning (6AM–2PM)', openingBalance: 200000, cashCollected: 450000, upiCollected: 320000, expenses: 80000, closingBalance: 570000, settledBy: 'Demo preview', status: 'settled' },
  { id: 2, date: '2026-10-10', shift: 'Afternoon (2PM–9PM)', openingBalance: 570000, cashCollected: 310000, upiCollected: 280000, expenses: 40000, closingBalance: 840000, settledBy: 'Demo preview', status: 'pending' },
  { id: 3, date: '2026-10-10', shift: 'Night (9PM–6AM)', openingBalance: 840000, cashCollected: 120000, upiCollected: 90000, expenses: 20000, closingBalance: 940000, settledBy: '—', status: 'pending' },
];
