// Responsibility: AdminSubscriptionsPage component owned by admin_subscriptions; responsibility folder: admin_subscriptions_components_views.
'use client';

// RESPONSIBILITY: Entry page for the admin_subscriptions module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useAdminSubscriptionsPageState } from '@/app/frontend_admin/admin_finance/finance_subscriptions/hooks/useAdminFinanceSubscriptionsPageState';
import { useTranslations } from 'next-intl';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';

import { formatAdminSubscriptionsCurrency, formatDate } from '@/app/frontend_admin/admin_finance/finance_subscriptions/utils/AdminFinanceSubscriptionsFormat';
import type { AdminSubscriptionsDemoSubscription } from '@/app/frontend_admin/admin_finance/finance_subscriptions/types/AdminFinanceSubscriptionsTypes';
import { RefreshCw, Eye, Download, Upload, Printer, MessageSquare, Send, Mail } from 'lucide-react';
import { serializeAdminSubscriptionsCsv } from '@/app/frontend_admin/admin_finance/finance_subscriptions/utils/AdminFinanceSubscriptionsCsvUtils';

const STATUS_BADGE: Record<string, string> = {
  active:    'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-success-bg text-success-text border-success-bg',
  expired:   'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg',
  suspended: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-warning-bg text-warning-text border-warning-bg',
  cancelled: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-card text-text-secondary border-border',
};

function daysLeftAdminSystemBadgeClass(days: number) {
  if (days < 0) return 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg';
  if (days <= 7) return 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg';
  if (days <= 15) return 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-warning-bg text-warning-text border-warning-bg';
  return 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-success-bg text-success-text border-success-bg';
}

export function AdminSubscriptionsPage() {
  const t = useTranslations('ADMIN_SUBSCRIPTIONS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const { statusFilter, setStatusFilter, planFilter, setPlanFilter, shiftFilter, setShiftFilter, rows } = useAdminSubscriptionsPageState(isDemoMode);
  const exportCsv = () => {
    if (!isDemoMode) return;
    const blob = new Blob([serializeAdminSubscriptionsCsv(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-subscriptions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {!isDemoMode && <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
      <div className="admin-shared-toolbar-spread" >
        <div>
          <h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
          <p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
        </div>
        <div className="admin-shared-action-row" >
          <button type="button" data-testid="admin_subscriptions-page-control-001" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover" disabled title={t('IMPORT_UNAVAILABLE')}>
            <Upload size={18} strokeWidth={2}/> {t('IMPORT')}
          </button>
          <button type="button" data-testid="admin_subscriptions-page-control-002" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover" disabled={!isDemoMode} title={!isDemoMode ? t('EXPORT_UNAVAILABLE') : undefined} onClick={exportCsv}>
            <Download size={18} strokeWidth={2}/> {t('CSV')}
          </button>
          <button type="button" data-testid="admin_subscriptions-page-control-003" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover" disabled={!isDemoMode} title={!isDemoMode ? t('PRINT_UNAVAILABLE') : undefined} onClick={() => window.print()}>
            <Printer size={18} strokeWidth={2}/> {t('PRINT')}
          </button>
          <button type="button" data-testid="admin_subscriptions-page-control-004" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover admin-shared-text-success"  disabled title={t('WHATSAPP_UNAVAILABLE')}>
            <MessageSquare size={18} strokeWidth={2}/> {t('WHATSAPP')}
          </button>
          <button type="button" data-testid="admin_subscriptions-page-control-005" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover admin-shared-text-info"  disabled title={t('TELEGRAM_UNAVAILABLE')}>
            <Send size={18} strokeWidth={2}/> {t('TELEGRAM')}
          </button>
          <button type="button" data-testid="admin_subscriptions-page-control-006" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover admin-shared-text-primary"  disabled title={t('EMAIL_UNAVAILABLE')}>
            <Mail size={18} strokeWidth={2}/> {t('EMAIL')}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select data-testid="admin_subscriptions-page-control-007" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-40" aria-label={t('FILTER_STATUS')} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">{t('ALL_STATUS')}</option>
          <option value="active">{t('STATUS_ACTIVE')}</option>
          <option value="expired">{t('STATUS_EXPIRED')}</option>
          <option value="suspended">{t('STATUS_SUSPENDED')}</option>
          <option value="cancelled">{t('STATUS_CANCELLED')}</option>
        </select>
        <select data-testid="admin_subscriptions-page-control-008" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-40" aria-label={t('FILTER_PLAN')} value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
          <option value="all">{t('ALL_PLANS')}</option>
          <option value="Basic Plan">{t('PLAN_BASIC')}</option>
          <option value="Premium Plan">{t('PLAN_PREMIUM')}</option>
        </select>
        <select data-testid="admin_subscriptions-page-control-009" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 pr-8 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-40" aria-label={t('FILTER_SHIFT')} value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)}>
          <option value="all">{t('ALL_SHIFTS')}</option>
          <option value="Morning">{t('SHIFT_MORNING')}</option>
          <option value="Evening">{t('SHIFT_EVENING')}</option>
          <option value="Full Day">{t('SHIFT_FULL_DAY')}</option>
        </select>
      </div>

      <div className="space-y-3 md:hidden" aria-label={t('SUBSCRIPTIONS_MOBILE_LIST')}>
        {rows.length === 0 ? (
          <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-4"><p className="text-section-title font-semibold text-text-primary">{t('EMPTY')}</p></div>
        ) : rows.map((s) => (
          <article key={`mobile-${s.id}`} className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-4 space-y-3" aria-label={`${s.studentName}, ${s.smartId}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><h2 className="font-semibold break-words">{s.studentName}</h2><p className="font-mono text-caption text-text-secondary text-sm">{s.smartId}</p></div>
              <span className={STATUS_BADGE[s.status] || 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-card text-text-secondary border-border'}>{t(`STATUS_${s.status.toUpperCase()}`)}</span>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-caption text-text-secondary">{t('PLAN')}</dt><dd>{s.plan}</dd></div>
              <div><dt className="text-caption text-text-secondary">{t('SHIFT')}</dt><dd>{s.shift}</dd></div>
              <div><dt className="text-caption text-text-secondary">{t('START_DATE')}</dt><dd>{formatDate(s.startDate)}</dd></div>
              <div><dt className="text-caption text-text-secondary">{t('END_DATE')}</dt><dd>{formatDate(s.endDate)}</dd></div>
              <div><dt className="text-caption text-text-secondary">{t('DAYS_LEFT')}</dt><dd>{s.daysLeft < 0 ? t('DAYS_AGO', { count: Math.abs(s.daysLeft) }) : t('DAYS_REMAINING', { count: s.daysLeft })}</dd></div>
              <div><dt className="text-caption text-text-secondary">{t('TOTAL')}</dt><dd className="font-semibold">{formatAdminSubscriptionsCurrency(s.total)}</dd></div>
              <div><dt className="text-caption text-text-secondary">{t('PAID')}</dt><dd>{formatAdminSubscriptionsCurrency(s.paid)}</dd></div>
              <div><dt className="text-caption text-text-secondary">{t('DUE')}</dt><dd>{formatAdminSubscriptionsCurrency(s.due)}</dd></div>
            </dl>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-info-bg text-info-text border-info-bg opacity-60 cursor-not-allowed" disabled title={t('RENEW_DISABLED_TITLE')}>{t('RENEW')}</button>
              <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary opacity-60 cursor-not-allowed" disabled title={t('DETAIL_UNAVAILABLE', { name: s.studentName })}>{t('VIEW')}</button>
            </div>
          </article>
        ))}
      </div>
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card overflow-x-auto hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-highlight text-caption text-text-secondary">
              <th scope="col" className="text-left py-3 px-4">{t('STUDENT')}</th>
              <th scope="col" className="text-left py-3 px-4">{t('SMART_ID')}</th>
              <th scope="col" className="text-left py-3 px-4">{t('PLAN')}</th>
              <th scope="col" className="text-left py-3 px-4">{t('START_DATE')}</th>
              <th scope="col" className="text-left py-3 px-4">{t('END_DATE')}</th>
              <th scope="col" className="text-left py-3 px-4">{t('DAYS_LEFT')}</th>
              <th scope="col" className="text-right py-3 px-4">{t('BASE')}</th>
              <th scope="col" className="text-right py-3 px-4">{t('DISCOUNT')}</th>
              <th scope="col" className="text-right py-3 px-4">{t('TOTAL')}</th>
              <th scope="col" className="text-right py-3 px-4">{t('PAID')}</th>
              <th scope="col" className="text-right py-3 px-4">{t('DUE')}</th>
              <th scope="col" className="text-left py-3 px-4">{t('STATUS')}</th>
              <th scope="col" className="text-right py-3 px-4">{t('ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={13}>
                  <div data-testid="admin_subscriptions-page-state-010" className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center">
                    <div data-testid="admin_subscriptions-page-state-011" className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary">📋</div>
                    <p data-testid="admin_subscriptions-page-state-012" className="text-section-title font-semibold text-text-primary">{t('EMPTY')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr key={s.id} className="motion-safe:transition-colors hover:bg-primary-subtle border-b border-border text-text-primary">
                  <td className="py-3 px-4 text-body font-semibold text-text-primary">{s.studentName}</td>
                  <td className="py-3 px-4 font-mono text-caption text-text-secondary">{s.smartId}</td>
                  <td className="py-3 px-4 text-body text-text-primary">{s.plan}</td>
                  <td className="py-3 px-4 text-caption text-text-secondary">{formatDate(s.startDate)}</td>
                  <td className="py-3 px-4 text-caption text-text-secondary">{formatDate(s.endDate)}</td>
                  <td className="py-3 px-4">
                    <span data-testid="admin_subscriptions-page-state-013" className={daysLeftAdminSystemBadgeClass(s.daysLeft)}>
                      {s.daysLeft < 0 ? t('DAYS_AGO', { count: Math.abs(s.daysLeft) }) : t('DAYS_REMAINING', { count: s.daysLeft })}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-body text-text-primary">{formatAdminSubscriptionsCurrency(s.base)}</td>
                  <td className="py-3 px-4 text-right text-success-text">{formatAdminSubscriptionsCurrency(s.discount)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-body text-text-primary">{formatAdminSubscriptionsCurrency(s.total)}</td>
                  <td className="py-3 px-4 text-right text-success-text">{formatAdminSubscriptionsCurrency(s.paid)}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${s.due > 0 ? 'text-danger-text' : 'text-body text-text-primary'}`}>
                    {formatAdminSubscriptionsCurrency(s.due)}
                  </td>
                  <td className="py-3 px-4">
                    <span data-testid="admin_subscriptions-page-state-014" className={STATUS_BADGE[s.status] || 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-card text-text-secondary border-border'}>{t(`STATUS_${s.status.toUpperCase()}`)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button data-testid="admin_subscriptions-page-control-015"
                        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-info-bg text-info-text border-info-bg cursor-not-allowed opacity-60"
                        type="button"
                        disabled
                        title={t('RENEW_DISABLED_TITLE')}
                      >
                        <RefreshCw size={18} strokeWidth={2} /> {t('RENEW')}
                      </button>
                      <button type="button" data-testid="admin_subscriptions-page-control-016"
                        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-not-allowed opacity-60"
                        disabled
                        title={t('DETAIL_UNAVAILABLE', { name: s.studentName })}
                      >
                        <Eye size={18} strokeWidth={2}/> {t('VIEW')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
