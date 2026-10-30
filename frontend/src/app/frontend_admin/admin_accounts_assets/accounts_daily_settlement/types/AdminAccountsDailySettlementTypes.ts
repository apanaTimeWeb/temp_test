import type { AdminAccountingExpenseCategoryColor } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/config/admin_accounts_daily_settlement.url_config';
import type { AdminAccountsDailySettlementScenario } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/tests/harness/bootstrap';
import type { ReactNode } from 'react';

/** Monetary fields in this module are stored in minor units (paise). */

export interface AdminAccountsDailySettlementEntry {
  id: number;
  date: string;
  shift: string;
  openingBalance: number;
  cashCollected: number;
  upiCollected: number;
  expenses: number;
  closingBalance: number;
  settledBy: string;
  status: AdminAccountsDailySettlementEntryStatus;
}

export interface AdminAccountingAsset {
  id: number;
  name: string;
  category: string;
  purchaseDate: string;
  purchaseValue: number;
  currentValue: number;
  location: string;
  status: AdminAccountingAssetStatus;
}

export interface AdminAccountingMaintenanceLog {
  id: number;
  assetName: string;
  issue: string;
  reportedDate: string;
  scheduledDate: string;
  vendor: string;
  cost: number;
  status: AdminAccountingMaintenanceLogStatus;
}

export interface AdminAccountingExpense {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  paidBy: string;
  mode: AdminAccountingExpenseMode;
  notes: string;
}

export interface AdminAccountingExpenseCategory {
  id: number;
  name: string;
  budget: number;
  spent: number;
  color: AdminAccountingExpenseCategoryColor;
}

export interface AdminAccountingSeatGapRow {
  seatNo: string;
  shift: string;
  floor: string;
  lastOccupied: string;
  gapDays: number;
  revenueLoss: number;
  status: AdminAccountingSeatGapRowStatus;
}

export interface AdminAccountingShiftGap {
  shift: string;
  totalSeats: number;
  occupied: number;
  vacant: number;
  occupancyPct: number;
  avgGapDays: number;
  revenueLoss: number;
}

export interface AdminAccountingDayGap {
  date: string;
  shift: string;
  seatNo: string;
  gapDays: number;
  loss: number;
}

export interface AdminAccountingApiRecord {
  id?: string | number;
  [key: string]: unknown;
}

export type AdminAccountsDailySettlementEntryStatus = 'pending' | 'settled';
export type AdminAccountingAssetStatus = 'active' | 'maintenance' | 'disposed';
export type AdminAccountingMaintenanceLogStatus = 'pending' | 'in-progress' | 'completed';
export type AdminAccountingExpenseMode = 'cash' | 'upi' | 'card' | 'bank';
export type AdminAccountingSeatGapRowStatus = 'vacant' | 'maintenance';

export type Entry = AdminAccountsDailySettlementEntry;

export interface AdminAccountsDailySettlementHarnessProps {
  children: ReactNode;
  scenario?: AdminAccountsDailySettlementScenario;
}
