import type { ReactNode } from 'react';
import type { AdminDashboardReportsAnalyticsScenario } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/mocks/scenarios/admin_dashboard_reports.scenarios';

export type AdminDashboardReportsReportCategory = 'members' | 'finance' | 'seats_shifts' | 'accounts_assets' | 'staff';
export type AdminDashboardReportsAnalyticsKpiValueKind = 'currency' | 'count';
export type AdminDashboardReportsAnalyticsOccupancyItemToken = 'chart-primary' | 'chart-success' | 'chart-warning' | 'chart-info' | 'chart-danger' | 'chart-secondary';
export type AdminDashboardReportsAnalyticsRange = 'thisMonth' | 'last3Months' | 'thisYear';
export type AdminDashboardReportsView = 'analytics' | 'library';

/** Source-bounded response record. No undeclared production DTO fields are inferred. */
export interface AdminDashboardReportsAnalyticsApiRecord { id?: string | number; [key: string]: unknown }

/** Metadata-only catalog entry; it cannot be exported as a live report. */
export type AdminDashboardReportsReport = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: AdminDashboardReportsReportCategory;
  dataStatus: 'contract_pending';
  exportable: false;
};

export interface AdminDashboardReportsAnalyticsKpi {
  label: string;
  amountMinor: number | null;
  count: number | null;
  trend: { value: string; up: boolean };
  sub: string;
  valueKind: AdminDashboardReportsAnalyticsKpiValueKind;
}

export interface AdminDashboardReportsAnalyticsIncomeExpensePoint {
  month: string;
  incomeMinor: number;
  expenseMinor: number;
}

export interface AdminDashboardReportsAnalyticsOccupancyItem {
  name: string;
  value: number;
  token: AdminDashboardReportsAnalyticsOccupancyItemToken;
}

export interface AdminDashboardReportsAnalyticsRevenuePoint { month: string; revenueMinor: number }
export interface AdminDashboardReportsAnalyticsStudentGrowthPoint { month: string; joined: number; exited: number }
export interface AdminDashboardReportsAnalyticsBranchSummary { branch: string; revenueMinor: number; expenseMinor: number; students: number; occupancy: number }

export interface AdminDashboardReportsAnalyticsDataset {
  /** Applies to this fixture only; live reports remain unavailable until the host contract supplies currency identity. */
  currencyCode: string;
  kpis: AdminDashboardReportsAnalyticsKpi[];
  incomeVsExpense: Record<AdminDashboardReportsAnalyticsRange, AdminDashboardReportsAnalyticsIncomeExpensePoint[]>;
  shiftOccupancy: AdminDashboardReportsAnalyticsOccupancyItem[];
  revenueTrend: Record<AdminDashboardReportsAnalyticsRange, AdminDashboardReportsAnalyticsRevenuePoint[]>;
  studentGrowth: Record<AdminDashboardReportsAnalyticsRange, AdminDashboardReportsAnalyticsStudentGrowthPoint[]>;
  branchSummary: AdminDashboardReportsAnalyticsBranchSummary[];
}

export interface AdminDashboardReportsAnalyticsPageHeaderSectionProps {
  range: AdminDashboardReportsAnalyticsRange;
  onRangeChange: (range: AdminDashboardReportsAnalyticsRange) => void;
  branch: string;
  branchOptions: readonly string[];
  onBranchChange: (branch: string) => void;
  isDemoMode: boolean;
  onPrint: () => void;
  onExportCsv: () => void;
}

export interface AdminDashboardReportsAnalyticsPrimaryChartsGridProps {
  data: AdminDashboardReportsAnalyticsDataset;
  range: AdminDashboardReportsAnalyticsRange;
  locale: string;
}

export interface AdminDashboardReportsAnalyticsSecondaryInsightsSectionProps {
  data: AdminDashboardReportsAnalyticsDataset;
  range: AdminDashboardReportsAnalyticsRange;
  locale: string;
  branches: readonly AdminDashboardReportsAnalyticsBranchSummary[];
}

export interface AdminDashboardReportsAnalyticsHarnessProps {
  children: ReactNode;
  scenario?: AdminDashboardReportsAnalyticsScenario;
}
