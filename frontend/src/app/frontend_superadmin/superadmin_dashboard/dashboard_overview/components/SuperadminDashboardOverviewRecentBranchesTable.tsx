'use client';
/** Responsibility: Superadmin Dashboard Recent Branches Table; displays newly created branches with capacity, location, manager, and status. */
import Link from 'next/link';
import { GitBranch, MapPin, Users, Building, ArrowUpRight } from 'lucide-react';
import type { SuperadminDashboardRecentBranch } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config';

interface SuperadminDashboardOverviewRecentBranchesTableProps {
  branches: SuperadminDashboardRecentBranch[];
}

export default function SuperadminDashboardOverviewRecentBranchesTable({
  branches,
}: SuperadminDashboardOverviewRecentBranchesTableProps) {
  return (
    <div className="rounded-2xl border border-cyan-500/25 bg-[#081b24]/90 shadow-md overflow-hidden">
      {/* Table Header */}
      <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30">
            <GitBranch size={18} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Recently Created Branches</h2>
            <p className="text-xs text-slate-400">Operational branches registered across all libraries</p>
          </div>
        </div>

        <Link
          href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.BRANCHES}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-600/30 hover:border-cyan-400 motion-safe:transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <span>View All Branches</span>
          <ArrowUpRight size={13} className="text-cyan-400" />
        </Link>
      </div>

      {/* Responsive Cards / Table Grid */}
      <div className="p-4 sm:p-6 divide-y divide-cyan-500/10">
        {branches.map((branch) => (
          <div
            key={branch.id}
            className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3 group"
          >
            {/* Left: Branch & Library Info */}
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">
                  {branch.branchName}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    branch.status === 'active'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${branch.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  {branch.status === 'active' ? 'Active' : 'Setup Pending'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                <span className="flex items-center gap-1 text-slate-300">
                  <Building size={12} className="text-slate-400" />
                  {branch.libraryName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-slate-400" />
                  {branch.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-cyan-300 font-medium">
                  <Users size={12} />
                  {branch.seats} Seats
                </span>
                <span>•</span>
                <span>Manager: <strong className="text-slate-300">{branch.manager}</strong></span>
              </div>
            </div>

            {/* Right: Meta & Actions */}
            <div className="flex items-center gap-3 self-end md:self-center shrink-0">
              <span className="text-xs text-slate-400">{branch.createdAt}</span>
              <Link
                href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.BRANCHES}
                className="inline-flex min-h-8 px-3 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/15 text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-600/30 motion-safe:transition-all"
              >
                <span>Manage</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
