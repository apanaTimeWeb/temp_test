'use client';

// RESPONSIBILITY: Render executive multi-branch operational pulse covering urgent grievances, daily EOD cash reconciliation, renewals dues pipeline, and staff/facility readiness.
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

export interface OperationsPulseCard {
  id: string;
  categoryKey: string;
  titleKey: string;
  badgeKey: string;
  badgeTheme: string;
  valueKey: string;
  detailKey: string;
  actionTextKey: string;
  actionHref: string;
  icon: React.ElementType;
  iconBoxTheme: string;
  borderTheme: string;
}

export const ADMIN_OPERATIONS_PULSE_CARDS: OperationsPulseCard[] = [
  {
    id: 'pulse-complaints',
    categoryKey: 'PULSE_COMPLAINTS_CAT',
    titleKey: 'PULSE_COMPLAINTS_TITLE',
    badgeKey: 'PULSE_COMPLAINTS_BADGE',
    badgeTheme: 'border-danger bg-danger-bg text-danger-text',
    valueKey: 'PULSE_COMPLAINTS_VAL',
    detailKey: 'PULSE_COMPLAINTS_DETAIL',
    actionTextKey: 'PULSE_COMPLAINTS_CTA',
    actionHref: ADMIN_ROUTES.COMMUNICATION_COMPLAINTS,
    icon: AlertTriangle,
    iconBoxTheme: 'bg-danger-bg border-danger text-danger-text',
    borderTheme: 'border-border hover:border-danger bg-card',
  },
  {
    id: 'pulse-settlement',
    categoryKey: 'PULSE_SETTLEMENT_CAT',
    titleKey: 'PULSE_SETTLEMENT_TITLE',
    badgeKey: 'PULSE_SETTLEMENT_BADGE',
    badgeTheme: 'border-warning bg-warning-bg text-warning-text',
    valueKey: 'PULSE_SETTLEMENT_VAL',
    detailKey: 'PULSE_SETTLEMENT_DETAIL',
    actionTextKey: 'PULSE_SETTLEMENT_CTA',
    actionHref: ADMIN_ROUTES.ACCOUNTS_DAILY_SETTLEMENT,
    icon: Receipt,
    iconBoxTheme: 'bg-warning-bg border-warning text-warning-text',
    borderTheme: 'border-border hover:border-warning bg-card',
  },
  {
    id: 'pulse-renewals',
    categoryKey: 'PULSE_RENEWALS_CAT',
    titleKey: 'PULSE_RENEWALS_TITLE',
    badgeKey: 'PULSE_RENEWALS_BADGE',
    badgeTheme: 'border-border-focus bg-primary-subtle text-primary',
    valueKey: 'PULSE_RENEWALS_VAL',
    detailKey: 'PULSE_RENEWALS_DETAIL',
    actionTextKey: 'PULSE_RENEWALS_CTA',
    actionHref: ADMIN_ROUTES.FINANCE_AUTO_SUSPEND,
    icon: Clock,
    iconBoxTheme: 'bg-primary-subtle border-border-focus text-primary',
    borderTheme: 'border-border hover:border-border-focus bg-card',
  },
  {
    id: 'pulse-facility',
    categoryKey: 'PULSE_FACILITY_CAT',
    titleKey: 'PULSE_FACILITY_TITLE',
    badgeKey: 'PULSE_FACILITY_BADGE',
    badgeTheme: 'border-success bg-success-bg text-success-text',
    valueKey: 'PULSE_FACILITY_VAL',
    detailKey: 'PULSE_FACILITY_DETAIL',
    actionTextKey: 'PULSE_FACILITY_CTA',
    actionHref: ADMIN_ROUTES.STAFF_ATTENDANCE,
    icon: ShieldCheck,
    iconBoxTheme: 'bg-success-bg border-success text-success-text',
    borderTheme: 'border-border hover:border-success bg-card',
  },
];

export function AdminDashboardOperationsPulse() {
  const t = useTranslations('ADMIN_DASHBOARD');
  return (
    <section aria-labelledby="operations-pulse-heading" className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h2 id="operations-pulse-heading" className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-success motion-safe:animate-pulse" aria-hidden="true" />
            <span>{t('PULSE_HEADING')}</span>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">{t('PULSE_SUBTITLE')}</p>
        </div>
        <span className="text-micro font-semibold text-text-secondary bg-card px-2.5 py-1 rounded-lg border border-border self-start sm:self-auto">
          {t('PULSE_UPDATED_SYNCED')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {ADMIN_OPERATIONS_PULSE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`rounded-2xl border p-4 sm:p-5 shadow-card motion-safe:transition-colors motion-safe:duration-base flex flex-col justify-between gap-4 ${card.borderTheme}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-2.5 rounded-xl border ${card.iconBoxTheme}`}>
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-micro font-bold border tracking-wide ${card.badgeTheme}`}>
                    {t(card.badgeKey)}
                  </span>
                </div>

                <div>
                  <span className="text-micro font-bold uppercase tracking-wider text-text-secondary">
                    {t(card.categoryKey)}
                  </span>
                  <h3 className="text-sm font-bold text-text-primary truncate mt-0.5">
                    {t(card.titleKey)}
                  </h3>
                  <div className="text-lg sm:text-xl font-black text-text-primary tracking-tight mt-1">
                    {t(card.valueKey)}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mt-1.5 line-clamp-2">
                    {t(card.detailKey)}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <Link
                  href={card.actionHref}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline motion-safe:transition-colors group cursor-pointer"
                >
                  <span>{t(card.actionTextKey)}</span>
                  <ArrowRight size={13} className="motion-safe:transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default AdminDashboardOperationsPulse;
