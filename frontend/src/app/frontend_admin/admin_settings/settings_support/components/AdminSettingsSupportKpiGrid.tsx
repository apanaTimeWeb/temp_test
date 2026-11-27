'use client';

// RESPONSIBILITY: AdminSettingsSupportKpiGrid component owned by admin_settings/settings_support.

import { AlertCircle, CheckCircle2, Ticket, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminSettingsSupportKpiGridProps {
  total: number;
  open: number;
  resolved: number;
}

export function AdminSettingsSupportKpiGrid({
  total,
  open,
  resolved,
}: AdminSettingsSupportKpiGridProps) {
  const t = useTranslations('ADMIN_SUPPORT');

  const cards = [
    {
      label: t('TICKETS_TITLE'),
      value: total,
      badge: 'Total Raised',
      Icon: Ticket,
      iconBox: 'bg-primary-subtle border-border-focus text-primary',
      valueClass: 'text-text-primary',
      badgeClass: 'bg-primary-subtle border-border-focus text-primary',
    },
    {
      label: t('TICKET_OPEN'),
      value: open,
      badge: 'Awaiting Action',
      Icon: AlertCircle,
      iconBox: 'bg-warning-bg border-warning text-warning-text',
      valueClass: 'text-warning-text',
      badgeClass: 'bg-warning-bg border-warning text-warning-text',
    },
    {
      label: t('TICKET_RESOLVED'),
      value: resolved,
      badge: 'Closed & Verified',
      Icon: CheckCircle2,
      iconBox: 'bg-success-bg border-success text-success-text',
      valueClass: 'text-success-text',
      badgeClass: 'bg-success-bg border-success text-success-text',
    },
    {
      label: 'Response SLA',
      value: '< 15 mins',
      badge: '24/7 Priority Support',
      Icon: Zap,
      iconBox: 'bg-info-bg border-info text-info-text',
      valueClass: 'text-info-text',
      badgeClass: 'bg-info-bg border-info text-info-text',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.badge}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card motion-safe:transition-shadow motion-safe:duration-slow hover:shadow-popover"
        >
          <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              {card.label}
            </span>
            <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${card.iconBox}`}>
              <card.Icon size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
          </div>
          <p className={`mt-3 text-2xl font-bold tracking-tight ${card.valueClass}`}>{card.value}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-text-secondary">
            <span className={`inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border ${card.badgeClass}`}>
              {card.badge}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
