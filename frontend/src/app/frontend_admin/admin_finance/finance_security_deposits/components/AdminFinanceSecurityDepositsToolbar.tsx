'use client';
// Responsibility: AdminFinanceSecurityDepositsToolbar component owned by admin_finance; responsibility folder: admin_finance_security_deposits_sections.

// RESPONSIBILITY: Presents the security-deposit page context and its status filter.

import { useTranslations } from 'next-intl';
import type { AdminFinanceSecurityDepositsToolbarProps } from '@/app/frontend_admin/admin_finance/finance_security_deposits/types/AdminFinanceSecurityDepositsTypes';


export default function AdminFinanceSecurityDepositsToolbar({ isLiveMode, statusFilter, onStatusFilterChange }: AdminFinanceSecurityDepositsToolbarProps) {
  const t = useTranslations('ADMIN_FINANCE_SECURITY_DEPOSITS');
  return (
    <section className="space-y-4" aria-label={t('TITLE')}>
      {!isLiveMode && (
        <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">
          {t('LIVE_UNAVAILABLE')}
        </p>
      )}
      <div>
        <h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
        <p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="admin-finance-security-deposit-status">{t('FILTER_LABEL')}</label>
        <select id="admin-finance-security-deposit-status" data-testid="admin_finance-page-control-001" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-40" value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)}>
          <option value="all">{t('ALL_STATUS')}</option>
          <option value="held">{t('STATUS_HELD')}</option>
          <option value="refunded">{t('STATUS_REFUNDED')}</option>
          <option value="forfeited">{t('STATUS_FORFEITED')}</option>
        </select>
      </div>
    </section>
  );
}


export type { AdminFinanceSecurityDepositsToolbarProps };
