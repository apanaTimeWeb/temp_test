'use client';

// RESPONSIBILITY: Render executive multi-branch operational pulse covering urgent grievances, daily EOD cash reconciliation, renewals dues pipeline, and staff/facility readiness.
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Key,
  Receipt,
  ShieldCheck,
  Users,
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
    badgeTheme: 'border-rose-500/30 bg-rose-500/15 text-rose-400',
    value: '2 Urgent Pending',
    detail: 'Karol Bagh AC repair · Wi-Fi mesh packet loss (14 resolved this week)',
    actionText: 'Review Complaints',
    actionHref: ADMIN_ROUTES.COMMUNICATION_COMPLAINTS,
    icon: AlertTriangle,
    iconBoxTheme: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
    borderTheme: 'border-rose-500/25 hover:border-rose-500/40 bg-gradient-to-br from-[#1a0a10]/95 via-[#1a0a10]/90 to-[#270e17]/80',
  },
  {
    id: 'pulse-settlement',
    category: 'Daily Reconciliation',
    title: 'EOD Cash & Expenses',
    badge: '1 Voucher Pending',
    badgeTheme: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
    value: '3/3 Branches Settled',
    detail: 'Yesterday ₹48,500 tallied · 1 Electrical Voucher (₹3,500) awaiting approval',
    actionText: 'Verify Settlement',
    actionHref: ADMIN_ROUTES.ACCOUNTS_DAILY_SETTLEMENT,
    icon: Receipt,
    iconBoxTheme: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    borderTheme: 'border-amber-500/25 hover:border-amber-500/40 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80',
  },
  {
    id: 'pulse-renewals',
    category: 'Revenue Protection',
    title: 'Renewals & Dues Pipeline',
    badge: '48h Window',
    badgeTheme: 'border-indigo-500/30 bg-indigo-500/15 text-indigo-300',
    value: '38 Expiring in 48h',
    detail: '₹42,000 recoverable dues · 6 auto-suspended accounts awaiting fee clearance',
    actionText: 'Open Dues Pipeline',
    actionHref: ADMIN_ROUTES.FINANCE_AUTO_SUSPEND,
    icon: Clock,
    iconBoxTheme: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
    borderTheme: 'border-indigo-500/25 hover:border-indigo-500/40 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80',
  },
  {
    id: 'pulse-facility',
    category: 'Operational Readiness',
    title: 'Staff & Facility Health',
    badge: 'All On-Duty',
    badgeTheme: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
    value: '3/3 Branches Open',
    detail: 'All 5 managers punched in · Lockers 78% occupied (142/180 assigned)',
    actionText: 'Staff Attendance',
    actionHref: ADMIN_ROUTES.STAFF_ATTENDANCE,
    icon: ShieldCheck,
    iconBoxTheme: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    borderTheme: 'border-emerald-500/25 hover:border-emerald-500/40 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80',
  },
];

export function AdminDashboardOperationsPulse() {
  return (
    <section aria-labelledby="operations-pulse-heading" className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h2 id="operations-pulse-heading" className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span>Network Operations Pulse & Action Queue</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time operational alerts: student grievances, cash settlement clearances, renewal dues, and branch readiness.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          Updated: Live Synced
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {ADMIN_OPERATIONS_PULSE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`rounded-2xl border p-4 sm:p-5 shadow-xl transition-all duration-200 flex flex-col justify-between gap-4 ${card.borderTheme}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-2.5 rounded-xl border ${card.iconBoxTheme}`}>
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide ${card.badgeTheme}`}>
                    {card.badge}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {card.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 truncate mt-0.5">
                    {card.title}
                  </h3>
                  <div className="text-lg sm:text-xl font-black text-white tracking-tight mt-1">
                    {card.value}
                  </div>
                  <p className="text-xs text-slate-300/80 leading-relaxed mt-1.5 line-clamp-2">
                    {card.detail}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <Link
                  href={card.actionHref}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-indigo-300 transition-colors group cursor-pointer"
                >
                  <span>{card.actionText}</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
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
