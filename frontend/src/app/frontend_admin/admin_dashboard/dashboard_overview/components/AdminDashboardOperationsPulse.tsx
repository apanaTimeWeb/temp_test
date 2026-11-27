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
import Link from 'next/link';
import React from 'react';

export interface OperationsPulseCard {
  id: string;
  category: string;
  title: string;
  badge: string;
  badgeTheme: string;
  value: string;
  detail: string;
  actionText: string;
  actionHref: string;
  icon: React.ElementType;
  iconBoxTheme: string;
  borderTheme: string;
}

export const ADMIN_OPERATIONS_PULSE_CARDS: OperationsPulseCard[] = [
  {
    id: 'pulse-complaints',
    category: 'Grievance Hotline',
    title: 'Urgent Student Complaints',
    badge: '2 Action Needed',
    badgeTheme: 'border-danger bg-danger-bg text-danger-text',
    value: '2 Urgent Pending',
    detail: 'Karol Bagh AC repair · Wi-Fi mesh packet loss (14 resolved this week)',
    actionText: 'Review Complaints',
    actionHref: ADMIN_ROUTES.COMMUNICATION_COMPLAINTS,
    icon: AlertTriangle,
    iconBoxTheme: 'bg-danger-bg border-danger text-danger-text',
    borderTheme: 'border-border hover:border-danger bg-card',
  },
  {
    id: 'pulse-settlement',
    category: 'Daily Reconciliation',
    title: 'EOD Cash & Expenses',
    badge: '1 Voucher Pending',
    badgeTheme: 'border-warning bg-warning-bg text-warning-text',
    value: '3/3 Branches Settled',
    detail: 'Yesterday ₹48,500 tallied · 1 Electrical Voucher (₹3,500) awaiting approval',
    actionText: 'Verify Settlement',
    actionHref: ADMIN_ROUTES.ACCOUNTS_DAILY_SETTLEMENT,
    icon: Receipt,
    iconBoxTheme: 'bg-warning-bg border-warning text-warning-text',
    borderTheme: 'border-border hover:border-warning bg-card',
  },
  {
    id: 'pulse-renewals',
    category: 'Revenue Protection',
    title: 'Renewals & Dues Pipeline',
    badge: '48h Window',
    badgeTheme: 'border-border-focus bg-primary-subtle text-primary',
    value: '38 Expiring in 48h',
    detail: '₹42,000 recoverable dues · 6 auto-suspended accounts awaiting fee clearance',
    actionText: 'Open Dues Pipeline',
    actionHref: ADMIN_ROUTES.FINANCE_AUTO_SUSPEND,
    icon: Clock,
    iconBoxTheme: 'bg-primary-subtle border-border-focus text-primary',
    borderTheme: 'border-border hover:border-border-focus bg-card',
  },
  {
    id: 'pulse-facility',
    category: 'Operational Readiness',
    title: 'Staff & Facility Health',
    badge: 'All On-Duty',
    badgeTheme: 'border-success bg-success-bg text-success-text',
    value: '3/3 Branches Open',
    detail: 'All 5 managers punched in · Lockers 78% occupied (142/180 assigned)',
    actionText: 'Staff Attendance',
    actionHref: ADMIN_ROUTES.STAFF_ATTENDANCE,
    icon: ShieldCheck,
    iconBoxTheme: 'bg-success-bg border-success text-success-text',
    borderTheme: 'border-border hover:border-success bg-card',
  },
];

export function AdminDashboardOperationsPulse() {
  return (
    <section aria-labelledby="operations-pulse-heading" className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h2 id="operations-pulse-heading" className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-success motion-safe:animate-pulse" aria-hidden="true" />
            <span>Network Operations Pulse & Action Queue</span>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time operational alerts: student grievances, cash settlement clearances, renewal dues, and branch readiness.
          </p>
        </div>
        <span className="text-micro font-semibold text-text-secondary bg-card px-2.5 py-1 rounded-lg border border-border self-start sm:self-auto">
          Updated: Live Synced
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
                    {card.badge}
                  </span>
                </div>

                <div>
                  <span className="text-micro font-bold uppercase tracking-wider text-text-secondary">
                    {card.category}
                  </span>
                  <h3 className="text-sm font-bold text-text-primary truncate mt-0.5">
                    {card.title}
                  </h3>
                  <div className="text-lg sm:text-xl font-black text-text-primary tracking-tight mt-1">
                    {card.value}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed mt-1.5 line-clamp-2">
                    {card.detail}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <Link
                  href={card.actionHref}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline motion-safe:transition-colors group cursor-pointer"
                >
                  <span>{card.actionText}</span>
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
