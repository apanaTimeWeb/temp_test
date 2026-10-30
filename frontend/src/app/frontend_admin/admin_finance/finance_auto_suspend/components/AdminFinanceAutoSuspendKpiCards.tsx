// Responsibility: AdminFinanceAutoSuspendKpiCards component owned by admin_finance; responsibility folder: admin_finance_auto_suspend_sections.
'use client';

// RESPONSIBILITY: Displays the four policy metrics from the supplied feature state.

import { Ban, RotateCcw, Settings, UserCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { AdminFinanceAutoSuspendConfig } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';
import { displayValue } from '@/lib/display_value';
import type { AdminFinanceAutoSuspendKpiCardsProps } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';


export default function AdminFinanceAutoSuspendKpiCards({ config, isLoading }: AdminFinanceAutoSuspendKpiCardsProps) {
  const t = useTranslations('ADMIN_FINANCE_AUTO_SUSPEND');
  const cards = [
    { label: t('DAYS_BEFORE_SUSPEND'), value: isLoading ? '—' : displayValue(config?.daysBeforeSuspend), icon: Settings, variant: 'default' },
    { label: t('CURRENTLY_SUSPENDED'), value: isLoading ? '—' : displayValue(config?.currentlySuspended), icon: Ban, variant: 'danger' },
    { label: t('AUTO_RESTORED_MONTH'), value: isLoading ? '—' : displayValue(config?.autoRestoredThisMonth), icon: RotateCcw, variant: 'default' },
    { label: t('MANUAL_RESTORES'), value: isLoading ? '—' : displayValue(config?.manualRestores), icon: UserCheck, variant: 'default' },
  ] as const;
  return (
    <section className="grid gap-4 md:grid-cols-4" aria-label={t('METRICS')}>
      {cards.map(({ label, value, icon: Icon, variant }) => (
        <div key={label} className={`rounded-xl border border-border bg-card p-5 shadow-card ${variant === 'danger' ? 'border-danger-bg bg-danger-bg' : ''}`}>
          <div className="mb-2 flex items-center justify-between gap-3"><span className={`text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary ${variant === 'danger' ? 'text-danger-text' : ''}`}>{label}</span><Icon size={18} strokeWidth={2} className={variant === 'danger' ? 'text-danger-text' : 'text-text-secondary'} /></div>
          <p className={`mt-2 text-kpi font-bold text-text-primary ${variant === 'danger' ? 'text-danger-text' : ''}`}>{value}</p>
        </div>
      ))}
    </section>
  );
}


export type { AdminFinanceAutoSuspendKpiCardsProps };
