'use client';
// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.
import { Component, type ErrorInfo } from 'react';
import { ManagerMembersEnquiriesErrorFallback } from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_error_boundary/ManagerMembersEnquiriesErrorFallback';
import type { ManagerMembersEnquiriesErrorBoundaryProps, ManagerMembersEnquiriesErrorBoundaryState } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesComponentTypes';




export class ManagerMembersEnquiriesErrorBoundary extends Component<ManagerMembersEnquiriesErrorBoundaryProps, ManagerMembersEnquiriesErrorBoundaryState> {
  public state: ManagerMembersEnquiriesErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ManagerMembersEnquiriesErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ManagerMembersEnquiriesErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
