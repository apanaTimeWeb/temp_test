// RESPONSIBILITY: AdminPlansErrorBoundary contains rendering failures for the admin_plans feature and exposes a localized retry action.
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import type { AdminPlansErrorBoundaryProps, AdminPlansErrorBoundaryState } from '@/app/frontend_admin/admin_members/members_plans/types/AdminMembersPlansComponentTypes';


function AdminPlansErrorBoundaryFallback({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations('ADMIN_PLANS');
  return (
    <section className="admin-card p-6" role="alert" aria-live="assertive">
      <h2 className="admin-modal-title">{t('ERROR_BOUNDARY_TITLE')}</h2>
      <p className="admin-modal-desc">{t('ERROR_BOUNDARY_FALLBACK')}</p>
      <button type="button" className="admin-btn-primary mt-4" onClick={onRetry}>{t('ERROR_BOUNDARY_RETRY')}</button>
    </section>
  );
}

export class AdminPlansErrorBoundary extends React.Component<AdminPlansErrorBoundaryProps, AdminPlansErrorBoundaryState> {
  constructor(props: AdminPlansErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): AdminPlansErrorBoundaryState {
    return { hasError: true };
  }

  private handleRetry = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) return <AdminPlansErrorBoundaryFallback onRetry={this.handleRetry} />;
    return this.props.children;
  }
}
