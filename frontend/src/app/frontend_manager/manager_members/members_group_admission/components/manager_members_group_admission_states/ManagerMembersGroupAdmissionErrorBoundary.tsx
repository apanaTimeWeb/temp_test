'use client';
// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.
import { Component, type ErrorInfo } from 'react';
import { ManagerMembersGroupAdmissionErrorFallback } from '@/app/frontend_manager/manager_members/members_group_admission/components/manager_members_group_admission_error_boundary/ManagerMembersGroupAdmissionErrorFallback';
import type { ManagerMembersGroupAdmissionErrorBoundaryProps, ManagerMembersGroupAdmissionErrorBoundaryState } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionComponentTypes';




export class ManagerMembersGroupAdmissionErrorBoundary extends Component<ManagerMembersGroupAdmissionErrorBoundaryProps, ManagerMembersGroupAdmissionErrorBoundaryState> {
  public state: ManagerMembersGroupAdmissionErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ManagerMembersGroupAdmissionErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ManagerMembersGroupAdmissionErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
