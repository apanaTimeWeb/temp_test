// types/SuperadminAnalyticsBillingReportsTypes.ts
// Domain and DTO contracts for Superadmin Billing Reports

export type BillingPaymentStatus = 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED' | 'OVERDUE';
export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface SuperadminAnalyticsBillingReportsFilters {
  dateRange: string;
  libraryId: string;
  branchId: string;
  plan: string;
  status: string;
  adminId: string;
  paymentStatus: string;
  searchQuery: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PlanWiseIncomeItem {
  planName: string;
  revenueMinor: number;
  subscriberCount: number;
  percentage: number;
}

export interface BillingReportsKpiData {
  totalRevenueMinor: number;
  mrrMinor: number;
  yrrMinor: number;
  pendingInvoicesCount: number;
  pendingAmountMinor: number;
  failedPaymentsCount: number;
  failedAmountMinor: number;
  refundsCount: number;
  refundAmountMinor: number;
  planWiseIncome: PlanWiseIncomeItem[];
}

export interface BillingRevenueTrendPoint {
  period: string;
  collectedMinor: number;
  pendingMinor: number;
}

export interface BillingReportTableRecord {
  id: string;
  invoiceNumber: string;
  libraryName: string;
  branchName: string;
  planName: string;
  billingCycle: BillingCycle;
  amountMinor: number;
  taxMinor: number;
  paymentStatus: BillingPaymentStatus;
  paymentMethod: string;
  transactionId: string;
  invoiceDate: string;
  dueDate: string;
  paidAt: string | null;
}

export interface BillingReportsOverviewData {
  kpis: BillingReportsKpiData;
  revenueTrend: BillingRevenueTrendPoint[];
  items: BillingReportTableRecord[];
  totalCount: number;
  filterOptions: {
    libraries: Array<{ id: string; name: string }>;
    branches: Array<{ id: string; name: string }>;
    plans: string[];
    paymentStatuses: BillingPaymentStatus[];
    admins: Array<{ id: string; name: string }>;
  };
}

export type ExportFormatType = 'excel' | 'pdf' | 'csv' | 'print' | 'download';
