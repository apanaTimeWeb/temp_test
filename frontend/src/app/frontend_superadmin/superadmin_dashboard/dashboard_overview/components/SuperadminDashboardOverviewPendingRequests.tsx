'use client';
/** Responsibility: Superadmin Dashboard Pending Requests; manages approval workflows for branch creation and plan upgrade requests. */
import Link from 'next/link';
import { GitBranch, ArrowUpCircle, Check, ArrowUpRight, Clock, Building, ShieldCheck } from 'lucide-react';
import type {
  SuperadminDashboardPendingBranchRequest,
  SuperadminDashboardPendingUpgradeRequest,
} from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config';

interface SuperadminDashboardOverviewPendingRequestsProps {
  branchRequests: SuperadminDashboardPendingBranchRequest[];
  upgradeRequests: SuperadminDashboardPendingUpgradeRequest[];
}

export default function SuperadminDashboardOverviewPendingRequests({
  branchRequests,
  upgradeRequests,
}: SuperadminDashboardOverviewPendingRequestsProps) {
  return (
    <section aria-label="Pending Administrative Requests" className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
      {/* ─── Pending Branch Creation Requests ─── */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#08222a]/80 via-[#0b1c24] to-[#081820]/80 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-cyan-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400">
                <GitBranch size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Pending Branch Creation Requests</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {branchRequests.length} Pending
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Libraries seeking approval to launch new branches</p>
              </div>
            </div>

            <Link
              href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.BRANCHES}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* List of Branch Requests */}
          <div className="mt-4 space-y-3">
            {branchRequests.map((req) => (
              <div
                key={req.id}
                className="group p-3.5 rounded-xl border border-cyan-500/20 bg-slate-900/60 hover:bg-slate-900/90 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {req.branchName}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {req.seats} Seats
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building size={11} className="text-slate-400" />
                      {req.libraryName}
                    </span>
                    <span>•</span>
                    <span>{req.city}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock size={10} />
                      {req.requestedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.BRANCHES}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm transition-all cursor-pointer"
                  >
                    <Check size={12} />
                    <span>Approve</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-cyan-500/15 flex items-center justify-between text-[11px] text-slate-400">
          <span>Branch allocation policy: Automatic SLA limit within 24h</span>
          <Link href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.BRANCHES} className="text-cyan-400 hover:underline">
            Manage Limits
          </Link>
        </div>
      </div>

      {/* ─── Pending Upgrade Requests ─── */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#1a0f2b]/80 via-[#150c22] to-[#12081d]/80 p-5 shadow-lg backdrop-blur-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-purple-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
                <ArrowUpCircle size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Pending Upgrade Requests</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    {upgradeRequests.length} Requests
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Tenants requesting tier expansion and feature unlocks</p>
              </div>
            </div>

            <Link
              href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.PLANS}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* List of Upgrade Requests */}
          <div className="mt-4 space-y-3">
            {upgradeRequests.map((req) => (
              <div
                key={req.id}
                className="group p-3.5 rounded-xl border border-purple-500/20 bg-slate-900/60 hover:bg-slate-900/90 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                      {req.libraryName}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {req.priceDelta}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                    <span className="text-slate-400 line-through text-[11px]">{req.currentPlan}</span>
                    <span className="text-purple-400 font-semibold text-[11px]">➔ {req.requestedPlan}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock size={10} />
                      {req.requestedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.PLANS}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-sm transition-all cursor-pointer"
                  >
                    <ShieldCheck size={12} />
                    <span>Approve Upgrade</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-purple-500/15 flex items-center justify-between text-[11px] text-slate-400">
          <span>High ARR pipeline value: +₹27,700/mo pending approval</span>
          <Link href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.BILLING} className="text-purple-400 hover:underline">
            Billing Engine
          </Link>
        </div>
      </div>
    </section>
  );
}
