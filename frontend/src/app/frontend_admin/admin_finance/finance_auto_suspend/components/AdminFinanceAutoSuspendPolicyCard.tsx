// Responsibility: AdminFinanceAutoSuspendPolicyCard component owned by admin_finance; responsibility folder: admin_finance_auto_suspend_sections.
'use client';

// RESPONSIBILITY: Renders and edits the auto-suspend policy configuration.

import { Save, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { AdminFinanceAutoSuspendConfig } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';
import type { AdminFinanceAutoSuspendPolicyCardProps } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';


export default function AdminFinanceAutoSuspendPolicyCard(props: AdminFinanceAutoSuspendPolicyCardProps) {
  const t = useTranslations('ADMIN_FINANCE_AUTO_SUSPEND');
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-6" aria-label={t('POLICY_CONFIGURATION')}>
      <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 text-body text-text-primary font-semibold"><ShieldAlert size={18} className="text-text-secondary" strokeWidth={2} />{t('POLICY_CONFIGURATION')}</div>{!props.editing && <button type="button" data-testid="admin_finance-page-control-001" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer" onClick={props.onEdit} disabled={!props.canEdit} aria-disabled={!props.canEdit}>{t('EDIT')}</button>}</div>
      {props.isLoading ? <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-10 w-full" /> : props.editing ? (
        <div className="space-y-4">
          <div><label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="admin-finance-auto-suspend-days">{t('DAYS_LABEL')}</label><input id="admin-finance-auto-suspend-days" type="number" min="1" step="1" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={props.days} onChange={(event) => props.onDaysChange(event.target.value)} /><p className="mt-1 text-caption text-text-secondary">{t('DAYS_HINT')}</p></div>
          <div className="flex gap-2"><button type="button" data-testid="admin_finance-page-control-002" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-success-bg text-success-text border-success-bg cursor-pointer" onClick={props.onSave} disabled={props.updatePending}><Save size={18} strokeWidth={2} /> {props.updatePending ? t('SAVING') : t('SAVE_CONFIG')}</button><button type="button" data-testid="admin_finance-page-control-003" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer" onClick={props.onCancel}>{t('CANCEL')}</button></div>
        </div>
      ) : <p className="text-body text-text-secondary">{t('POLICY_SUMMARY', { days: props.config?.daysBeforeSuspend ?? '—' })}</p>}
    </section>
  );
}


export type { AdminFinanceAutoSuspendPolicyCardProps };
