/**
 * Module-owned, sample-only repository implementation. Each exported collection/object is a defensive
 * snapshot of the authored fixture data; these values are not a persistence or API contract.
 */
import type {
  Category as CategoryFixture,
  CategoryTone as CategoryToneFixture,
  DayGap as DayGapFixture,
  Entry as EntryFixture,
  GapRow as GapRowFixture,
  MaintenanceLog as MaintenanceLogFixture,
  ManagerAccountsExpensesAsset as ManagerAccountsExpensesAssetFixture,
  ManagerAccountsExpensesExpenseSample as ManagerAccountsExpensesExpenseSampleFixture,
  ShiftGap as ShiftGapFixture,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/config/manager_accounts_expenses.demo_data';
import {
  MANAGER_ACCOUNTING_SAMPLE_ASSETS as MANAGER_ACCOUNTING_SAMPLE_ASSETSFixture,
  MANAGER_ACCOUNTING_SAMPLE_CATEGORY_BREAKDOWN as MANAGER_ACCOUNTING_SAMPLE_CATEGORY_BREAKDOWNFixture,
  MANAGER_ACCOUNTING_SAMPLE_DAILY_SETTLEMENTS as MANAGER_ACCOUNTING_SAMPLE_DAILY_SETTLEMENTSFixture,
  MANAGER_ACCOUNTING_SAMPLE_EXPENSE_CATEGORIES as MANAGER_ACCOUNTING_SAMPLE_EXPENSE_CATEGORIESFixture,
  MANAGER_ACCOUNTING_SAMPLE_EXPENSES as MANAGER_ACCOUNTING_SAMPLE_EXPENSESFixture,
  MANAGER_ACCOUNTING_SAMPLE_MAINTENANCE_LOGS as MANAGER_ACCOUNTING_SAMPLE_MAINTENANCE_LOGSFixture,
  MANAGER_ACCOUNTING_SAMPLE_MONTHLY_FINANCIALS as MANAGER_ACCOUNTING_SAMPLE_MONTHLY_FINANCIALSFixture,
  MANAGER_ACCOUNTING_SAMPLE_SEAT_GAPS as MANAGER_ACCOUNTING_SAMPLE_SEAT_GAPSFixture,
  MANAGER_ACCOUNTING_SAMPLE_SHIFT_GAP_DAYS as MANAGER_ACCOUNTING_SAMPLE_SHIFT_GAP_DAYSFixture,
  MANAGER_ACCOUNTING_SAMPLE_SHIFT_GAPS as MANAGER_ACCOUNTING_SAMPLE_SHIFT_GAPSFixture,
} from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/config/manager_accounts_expenses.demo_data';

/** DATA FLOW: Module-owned sample fixtures -> defensive demo repository exports -> feature preview; sample data is not persistence. */

export type ManagerAccountsExpensesExpenseSample = ManagerAccountsExpensesExpenseSampleFixture;
export const MANAGER_ACCOUNTING_SAMPLE_EXPENSES = MANAGER_ACCOUNTING_SAMPLE_EXPENSESFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export type CategoryTone = CategoryToneFixture;
export type Category = CategoryFixture;
export type GapRow = GapRowFixture;
export type MaintenanceLog = MaintenanceLogFixture;
export type ShiftGap = ShiftGapFixture;
export type DayGap = DayGapFixture;
export type Entry = EntryFixture;
export const MANAGER_ACCOUNTING_SAMPLE_EXPENSE_CATEGORIES = MANAGER_ACCOUNTING_SAMPLE_EXPENSE_CATEGORIESFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_ACCOUNTING_SAMPLE_SEAT_GAPS = MANAGER_ACCOUNTING_SAMPLE_SEAT_GAPSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_ACCOUNTING_SAMPLE_MAINTENANCE_LOGS = MANAGER_ACCOUNTING_SAMPLE_MAINTENANCE_LOGSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_ACCOUNTING_SAMPLE_SHIFT_GAPS = MANAGER_ACCOUNTING_SAMPLE_SHIFT_GAPSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_ACCOUNTING_SAMPLE_SHIFT_GAP_DAYS = MANAGER_ACCOUNTING_SAMPLE_SHIFT_GAP_DAYSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_ACCOUNTING_SAMPLE_DAILY_SETTLEMENTS = MANAGER_ACCOUNTING_SAMPLE_DAILY_SETTLEMENTSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_ACCOUNTING_SAMPLE_MONTHLY_FINANCIALS = MANAGER_ACCOUNTING_SAMPLE_MONTHLY_FINANCIALSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export const MANAGER_ACCOUNTING_SAMPLE_CATEGORY_BREAKDOWN = MANAGER_ACCOUNTING_SAMPLE_CATEGORY_BREAKDOWNFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
export type ManagerAccountsExpensesAsset = ManagerAccountsExpensesAssetFixture;
export const MANAGER_ACCOUNTING_SAMPLE_ASSETS = MANAGER_ACCOUNTING_SAMPLE_ASSETSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
