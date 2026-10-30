import { useTranslations } from 'next-intl';
import { Toaster } from 'sonner';
import AdminAssetsRegisterPage from '@/app/frontend_admin/admin_accounts_assets/assets_register/components/AdminAssetsRegisterPage';
import React from 'react';
import type { AdminAssetsRegisterErrorBoundaryProps, AdminAssetsRegisterErrorBoundaryState } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterComponentTypes';

// Responsibility: asset-register route composition, localized recovery, and its single toast viewport.
'use client';

export default function AdminAssetsRegisterRoute() {
  const t = useTranslations('ADMIN_ACCOUNTING.ERROR_BOUNDARY');
  return <><AdminAssetsRegisterErrorBoundary fallbackTitle={t('TITLE')} fallbackDescription={t('DESCRIPTION')} retryLabel={t('RETRY')}><AdminAssetsRegisterPage /></AdminAssetsRegisterErrorBoundary><Toaster position="bottom-right" richColors closeButton /></>;
}

// Responsibility: contains render failures in the asset-register view and offers localized recovery.
'use client';

export class AdminAssetsRegisterErrorBoundary extends React.Component<AdminAssetsRegisterErrorBoundaryProps, AdminAssetsRegisterErrorBoundaryState> {
  constructor(props: AdminAssetsRegisterErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): AdminAssetsRegisterErrorBoundaryState { return { hasError: true }; }
  private handleRetry = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;
    return <section className="rounded-xl border border-border bg-card p-6" role="alert" aria-live="assertive"><h2 className="text-section-title font-semibold text-text-primary">{this.props.fallbackTitle}</h2><p className="mt-2 text-sm text-text-secondary">{this.props.fallbackDescription}</p><button type="button" className="mt-4 min-h-11 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={this.handleRetry}>{this.props.retryLabel}</button></section>;
  }
}
