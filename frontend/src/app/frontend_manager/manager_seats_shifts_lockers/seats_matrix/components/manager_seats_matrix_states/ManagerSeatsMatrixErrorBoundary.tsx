'use client';
// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Contain rendering failures within the components feature subtree. It does not own backend persistence or cross-feature business logic.
import { Component, type ErrorInfo } from 'react';
import { ManagerSeatsMatrixErrorFallback } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_error_boundary/ManagerSeatsMatrixErrorFallback';
import type { ManagerSeatsMatrixErrorBoundaryProps, ManagerSeatsMatrixErrorBoundaryState } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixComponentTypes';




export class ManagerSeatsMatrixErrorBoundary extends Component<ManagerSeatsMatrixErrorBoundaryProps, ManagerSeatsMatrixErrorBoundaryState> {
  public state: ManagerSeatsMatrixErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ManagerSeatsMatrixErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ManagerSeatsMatrixErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
