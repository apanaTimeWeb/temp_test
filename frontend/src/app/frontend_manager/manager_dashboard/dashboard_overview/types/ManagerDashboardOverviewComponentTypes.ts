/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerDashboardOverviewActionItem, ManagerDashboardOverviewKpiData, ManagerDashboardOverviewRecentAdmission, ManagerDashboardOverviewRecentEnquiry, ManagerDashboardOverviewSeatData } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewTypes';
import type { ErrorInfo, ReactNode } from 'react';

export type ManagerDashboardOverviewEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export interface ManagerDashboardOverviewErrorFallbackProps {
  onRetry: () => void;
}

// RESPONSIBILITY: Renders the read-only grid of KPI cards. Receives data via props. No API calls.
export interface ManagerDashboardOverviewKpiGridProps {
  kpiData: ManagerDashboardOverviewKpiData[];
}

export type ManagerDashboardOverviewQuickLinkTitleKey =
  | 'quick_all_students'
  | 'quick_enquiries'
  | 'quick_collect_fee'
  | 'quick_add_complaint'
  | 'quick_mark_attendance'
  | 'quick_qr_scanner';

export interface ManagerDashboardOverviewQuickLink { titleKey: ManagerDashboardOverviewQuickLinkTitleKey; href: string; }

export interface ManagerDashboardOverviewQuickLinksProps { links: ManagerDashboardOverviewQuickLink[]; }

export interface ManagerDashboardOverviewRecentActivityProps {
  admissions: ManagerDashboardOverviewRecentAdmission[];
  enquiries: ManagerDashboardOverviewRecentEnquiry[];
  studentsHref: string;
  enquiriesHref: string;
}

export interface ManagerDashboardOverviewErrorBoundaryProps {
  children: ReactNode;
  /** Optional host-provided, privacy-reviewed error reporting adapter. No telemetry is invented here. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ManagerDashboardOverviewErrorBoundaryState {
  hasError: boolean;
}

export interface ManagerDashboardOverviewErrorStateProps { message: string; onRetry?: () => void; }

export interface ManagerDashboardOverviewActionItemsProps { items: ManagerDashboardOverviewActionItem[]; }

// RESPONSIBILITY: Renders the seat matrix visual grid and handles routing to student list with seat filter. It does not own backend persistence or cross-feature business logic.
export interface ManagerDashboardOverviewSeatMatrixProps {
  seatData: ManagerDashboardOverviewSeatData[];
}

export type ManagerDashboardOverviewTrendTone = 'up' | 'down' | 'neutral';
