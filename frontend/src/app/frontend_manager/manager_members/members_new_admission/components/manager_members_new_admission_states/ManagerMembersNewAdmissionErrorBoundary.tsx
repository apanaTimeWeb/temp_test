'use client';
// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.
import { Component, type ErrorInfo } from 'react';
import { ManagerMembersNewAdmissionErrorFallback } from '@/app/frontend_manager/manager_members/members_new_admission/components/manager_members_new_admission_error_boundary/ManagerMembersNewAdmissionErrorFallback';
import type { ManagerMembersNewAdmissionErrorBoundaryProps, ManagerMembersNewAdmissionErrorBoundaryState } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionComponentTypes';




export class ManagerMembersNewAdmissionErrorBoundary extends Component<ManagerMembersNewAdmissionErrorBoundaryProps, ManagerMembersNewAdmissionErrorBoundaryState> {
  public state: ManagerMembersNewAdmissionErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ManagerMembersNewAdmissionErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ManagerMembersNewAdmissionErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
