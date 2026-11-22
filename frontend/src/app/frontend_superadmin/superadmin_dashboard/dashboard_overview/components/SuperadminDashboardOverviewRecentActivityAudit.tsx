'use client';
/** Responsibility: Superadmin Dashboard Activity & Audit; monitors live admin logins and root SuperAdmin operations audit trail. */
import Link from 'next/link';
import {
  ShieldCheck,
  History,
  ArrowUpRight,
  UserCheck,
  Laptop,
  MapPin,
  Clock,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import type {
  SuperadminDashboardAdminLoginRecord,
  SuperadminDashboardAuditRecord,
} from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config';

interface SuperadminDashboardOverviewRecentActivityAuditProps {
  adminLogins: SuperadminDashboardAdminLoginRecord[];
  superadminActivities: SuperadminDashboardAuditRecord[];
}

export default function SuperadminDashboardOverviewRecentActivityAudit({
  adminLogins,
  superadminActivities,
}: SuperadminDashboardOverviewRecentActivityAuditProps) {
  const getLoginStatusBadge = (status: SuperadminDashboardAdminLoginRecord['status']) => {
    switch (status) {
      case 'mfa_verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <KeyRound size={10} />
            MFA OK
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40">
            Success
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <ShieldAlert size={10} />
            Blocked
          </span>
        );
    }
  };

  return (
    <section aria-label="Logins & SuperAdmin Audit Trail" className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
      {/* ─── Latest Admin Logins ─── */}
      <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-[#0c1c2a]/80 via-[#0a1824] to-[#08141e]/80 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-sky-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400">
                <UserCheck size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Latest Admin Logins</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    Live Stream
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Authenticated sessions across tenant libraries</p>
              </div>
            </div>

            <Link
              href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SECURITY}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              <span>Security Log</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* List of admin logins */}
          <div className="mt-4 space-y-2.5">
            {adminLogins.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-sky-500/15 bg-slate-900/60 hover:bg-slate-900/90 hover:border-sky-500/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white">{item.adminName}</span>
                    <span className="text-[11px] text-slate-400">({item.libraryName})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 font-mono text-[10px] text-slate-300">
                      {item.ipAddress}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={10} className="text-slate-400" />
                      {item.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Laptop size={10} className="text-slate-400" />
                      {item.device}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  {getLoginStatusBadge(item.status)}
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <Clock size={9} />
                    {item.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-sky-500/15 flex items-center justify-between text-[11px] text-slate-400">
          <span>Active sessions auto-refreshed every 30s</span>
          <Link href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SECURITY} className="text-sky-400 hover:underline">
            Active Sessions ➔
          </Link>
        </div>
      </div>

      {/* ─── Recent SuperAdmin Activities (Audit Trail) ─── */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#121330]/80 via-[#101127] to-[#0d0e20]/80 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-indigo-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                <History size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Recent SuperAdmin Activities</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    Audit Log
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Tamper-evident administrative root events</p>
              </div>
            </div>

            <Link
              href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.AUDIT_LOGS}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>Full Audit</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* List of audit records */}
          <div className="mt-4 space-y-2.5">
            {superadminActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl border border-indigo-500/15 bg-slate-900/60 hover:bg-slate-900/90 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-indigo-300">{act.action}</span>
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/15 text-indigo-200 border border-indigo-500/30">
                      {act.module}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 truncate">
                    {act.target}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    By <strong className="text-slate-300">{act.actor}</strong> • IP: {act.ipAddress}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 justify-end">
                    <Clock size={10} />
                    {act.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-indigo-500/15 flex items-center justify-between text-[11px] text-slate-400">
          <span>Cryptographic hash verified on all records</span>
          <Link href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.AUDIT_LOGS} className="text-indigo-400 hover:underline">
            Export Audit Trail ➔
          </Link>
        </div>
      </div>
    </section>
  );
}
