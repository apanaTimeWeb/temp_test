// RESPONSIBILITY: Define local sample fixtures for accounting daily settlement; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_accounting/accounting_daily_settlement/mocks/fixtures/SuperadminAccountingDailySettlementSettlementMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminAccountingSettlementEntry } from '@/app/frontend_superadmin/superadmin_accounting/accounting_daily_settlement/types/superadmin_accounting_daily_settlement.types';

export const SUPERADMIN_ACCOUNTING_SETTLEMENT_SAMPLE_DATE = '2026-04-12';
/** Synthetic shift settlement rows. Changes made in the UI stay local and are not financial transactions. */
export const SUPERADMIN_ACCOUNTING_SAMPLE_SETTLEMENTS: readonly SuperadminAccountingSettlementEntry[] = [
  { id: 1, date: SUPERADMIN_ACCOUNTING_SETTLEMENT_SAMPLE_DATE, shift: 'Morning (6AM–2PM)', openingBalance: 2000, cashCollected: 4500, upiCollected: 3200, expenses: 800, closingBalance: 5700, settledBy: 'Sample Operator A', status: 'settled' },
  { id: 2, date: SUPERADMIN_ACCOUNTING_SETTLEMENT_SAMPLE_DATE, shift: 'Afternoon (2PM–9PM)', openingBalance: 5700, cashCollected: 3100, upiCollected: 2800, expenses: 400, closingBalance: 8400, settledBy: 'Sample Operator B', status: 'pending' },
  { id: 3, date: SUPERADMIN_ACCOUNTING_SETTLEMENT_SAMPLE_DATE, shift: 'Night (9PM–6AM)', openingBalance: 8400, cashCollected: 1200, upiCollected: 900, expenses: 200, closingBalance: 9400, settledBy: '—', status: 'pending' },
];
