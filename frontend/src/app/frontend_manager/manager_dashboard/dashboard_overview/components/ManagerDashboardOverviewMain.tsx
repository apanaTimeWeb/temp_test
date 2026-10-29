'use client';
// RESPONSIBILITY: Provide the page/orchestration entry component for the dashboard overview feature. It does not own backend persistence or cross-feature business logic.

import { ManagerDashboardOverviewClient } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_views/ManagerDashboardOverviewClient';
import { ManagerDashboardOverviewErrorBoundary } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_states/ManagerDashboardOverviewErrorBoundary';
export function ManagerDashboardOverviewMain() { return <ManagerDashboardOverviewErrorBoundary><ManagerDashboardOverviewClient /></ManagerDashboardOverviewErrorBoundary>; }
