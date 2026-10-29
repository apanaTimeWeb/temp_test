'use client';
// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.
import { Component, type ErrorInfo } from 'react';
import { ManagerMembersReferralBonusErrorFallback } from '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_error_boundary/ManagerMembersReferralBonusErrorFallback';
import type { ManagerMembersReferralBonusErrorBoundaryProps, ManagerMembersReferralBonusErrorBoundaryState } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';




export class ManagerMembersReferralBonusErrorBoundary extends Component<ManagerMembersReferralBonusErrorBoundaryProps, ManagerMembersReferralBonusErrorBoundaryState> {
  public state: ManagerMembersReferralBonusErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ManagerMembersReferralBonusErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ManagerMembersReferralBonusErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
