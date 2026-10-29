'use client';
// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.
import { Component, type ErrorInfo } from 'react';
import { ManagerMembersAlumniErrorFallback } from '@/app/frontend_manager/manager_members/members_alumni/components/manager_members_alumni_error_boundary/ManagerMembersAlumniErrorFallback';
import type { ManagerMembersAlumniErrorBoundaryProps, ManagerMembersAlumniErrorBoundaryState } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';




export class ManagerMembersAlumniErrorBoundary extends Component<ManagerMembersAlumniErrorBoundaryProps, ManagerMembersAlumniErrorBoundaryState> {
  public state: ManagerMembersAlumniErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ManagerMembersAlumniErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ManagerMembersAlumniErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
