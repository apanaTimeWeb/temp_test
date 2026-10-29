'use client';
// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.
import { Component, type ErrorInfo } from 'react';
import { ManagerMembersIdCardGeneratorErrorFallback } from '@/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_error_boundary/ManagerMembersIdCardGeneratorErrorFallback';
import type { ManagerMembersIdCardGeneratorErrorBoundaryProps, ManagerMembersIdCardGeneratorErrorBoundaryState } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';




export class ManagerMembersIdCardGeneratorErrorBoundary extends Component<ManagerMembersIdCardGeneratorErrorBoundaryProps, ManagerMembersIdCardGeneratorErrorBoundaryState> {
  public state: ManagerMembersIdCardGeneratorErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ManagerMembersIdCardGeneratorErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ManagerMembersIdCardGeneratorErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
