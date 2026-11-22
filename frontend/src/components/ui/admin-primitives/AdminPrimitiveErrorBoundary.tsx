'use client';
import React, { type ReactNode } from 'react';
import type { AdminErrorBoundaryProps, AdminErrorBoundaryState } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';


/** Generic error boundary: all localized text is injected by the role/feature owner. */
export default class AdminErrorBoundary extends React.Component<AdminErrorBoundaryProps, AdminErrorBoundaryState> {
  state: AdminErrorBoundaryState = { hasError: false, resetGeneration: 0 };
  static getDerivedStateFromError(): Partial<AdminErrorBoundaryState> { return { hasError: true }; }
  componentDidUpdate(previousProps: AdminErrorBoundaryProps) {
    const previousKeys = previousProps.resetKeys ?? [];
    const currentKeys = this.props.resetKeys ?? [];
    const resetKeyChanged = previousKeys.length !== currentKeys.length
      || previousKeys.some((key, index) => !Object.is(key, currentKeys[index]));
    if (this.state.hasError && resetKeyChanged) this.setState((state) => ({ hasError: false, resetGeneration: state.resetGeneration + 1 }));
  }

  private handleRetry = () => {
    this.props.onReset?.();
    this.setState((state) => ({ hasError: false, resetGeneration: state.resetGeneration + 1 }));
  };
  render() {
    if (this.state.hasError) return <section className={`rounded-lg border border-border bg-card p-6 ${this.props.className ?? ''}`} role="alert" aria-live="assertive"><h2 className="text-section-title font-semibold text-text-primary">{this.props.title}</h2><p className="mt-2 text-text-secondary">{this.props.description}</p><button type="button" className="admin-btn-primary mt-4 min-h-11" onClick={this.handleRetry}>{this.props.retryLabel}</button></section>;
    return <React.Fragment key={this.state.resetGeneration}>{this.props.children}</React.Fragment>;
  }
}


export type { AdminErrorBoundaryProps };
