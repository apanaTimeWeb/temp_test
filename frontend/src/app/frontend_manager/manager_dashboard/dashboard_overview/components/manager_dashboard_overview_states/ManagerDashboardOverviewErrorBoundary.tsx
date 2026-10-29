'use client';
// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.
import { Component, type ErrorInfo } from 'react';
import { ManagerDashboardOverviewErrorFallback } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_error_boundary/ManagerDashboardOverviewErrorFallback';
import type { ManagerDashboardOverviewErrorBoundaryProps, ManagerDashboardOverviewErrorBoundaryState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';




export class ManagerDashboardOverviewErrorBoundary extends Component<ManagerDashboardOverviewErrorBoundaryProps, ManagerDashboardOverviewErrorBoundaryState> {
  public state: ManagerDashboardOverviewErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ManagerDashboardOverviewErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ManagerDashboardOverviewErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
