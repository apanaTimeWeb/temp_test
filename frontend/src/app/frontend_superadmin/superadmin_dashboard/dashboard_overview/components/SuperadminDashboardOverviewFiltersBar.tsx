'use client';
/** Responsibility: Superadmin Dashboard Filters Bar; provides time-range and multi-dimensional filtering across libraries, branches, plans, and statuses. */
import { Calendar, Filter, RotateCcw, Building, GitBranch, Layers, ShieldAlert } from 'lucide-react';
import type { SuperadminDashboardFilterState } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';

interface SuperadminDashboardOverviewFiltersBarProps {
  filters: SuperadminDashboardFilterState;
  onChange: (updated: SuperadminDashboardFilterState) => void;
  onReset: () => void;
}

const TIME_RANGES: { id: SuperadminDashboardFilterState['timeRange']; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7 Days' },
  { id: '30d', label: '30 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'custom', label: 'Custom Date' },
];

const ACCOUNT_OPTIONS = [
  { value: 'all', label: 'All Accounts' },
  { value: 'apex', label: 'Apex Library Chain' },
  { value: 'gyanganga', label: 'Gyan Ganga Study Hub' },
  { value: 'central', label: 'Central Reading Spaces' },
  { value: 'successpoint', label: 'Success Point Library' },
  { value: 'elite', label: 'Elite Knowledge Center' },
];

const BRANCH_OPTIONS = [
  { value: 'all', label: 'All Branches' },
  { value: 'noida', label: 'Noida Sector 62' },
  { value: 'civillines', label: 'Civil Lines Prayagraj' },
  { value: 'fcroad', label: 'FC Road Pune' },
  { value: 'cscheme', label: 'C-Scheme Jaipur' },
  { value: 'vijaynagar', label: 'Vijay Nagar Indore' },
];

const PLAN_OPTIONS = [
  { value: 'all', label: 'All Plans' },
  { value: 'starter', label: 'Starter Tier' },
  { value: 'pro', label: 'Pro Tier' },
  { value: 'enterprise', label: 'Enterprise Tier' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active Only' },
  { value: 'suspended', label: 'Suspended Only' },
  { value: 'setup', label: 'Setup Pending' },
];

export default function SuperadminDashboardOverviewFiltersBar({
  filters,
  onChange,
  onReset,
}: SuperadminDashboardOverviewFiltersBarProps) {
  const isFiltered =
    filters.timeRange !== '30d' ||
    filters.account !== 'all' ||
    filters.branch !== 'all' ||
    filters.plan !== 'all' ||
    filters.status !== 'all';

  return (
    <section
      aria-label="Dashboard Metric Filters"
      className="w-full mb-6 rounded-2xl border border-slate-800/80 bg-gradient-to-r from-[#0c1322] via-[#0f172a] to-[#0c1322] p-4 sm:p-5 shadow-xl backdrop-blur-md"
    >
      <div className="flex flex-col gap-4">
        {/* Top Row: Time Range Pills & Reset */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800/60 pb-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Calendar size={15} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Time Range:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {TIME_RANGES.map((range) => {
                const isActive = filters.timeRange === range.id;
                return (
                  <button
                    key={range.id}
                    type="button"
                    onClick={() => onChange({ ...filters, timeRange: range.id })}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold motion-safe:transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50'
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset Filters Action */}
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 motion-safe:transition-all cursor-pointer self-end md:self-auto"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Bottom Row: Multi-Dimension Filters (Account, Branch, Plan, Status) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Account Filter */}
          <div className="relative">
            <label htmlFor="filter-account" className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1">
              <Building size={12} className="text-indigo-400" />
              <span>Account (Library)</span>
            </label>
            <select
              id="filter-account"
              value={filters.account}
              onChange={(e) => onChange({ ...filters, account: e.target.value })}
              className="w-full rounded-xl border border-slate-700/60 bg-slate-900/90 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 motion-safe:transition-all cursor-pointer"
            >
              {ACCOUNT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div className="relative">
            <label htmlFor="filter-branch" className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1">
              <GitBranch size={12} className="text-cyan-400" />
              <span>Branch</span>
            </label>
            <select
              id="filter-branch"
              value={filters.branch}
              onChange={(e) => onChange({ ...filters, branch: e.target.value })}
              className="w-full rounded-xl border border-slate-700/60 bg-slate-900/90 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 motion-safe:transition-all cursor-pointer"
            >
              {BRANCH_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Plan Filter */}
          <div className="relative">
            <label htmlFor="filter-plan" className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1">
              <Layers size={12} className="text-purple-400" />
              <span>Plan Tier</span>
            </label>
            <select
              id="filter-plan"
              value={filters.plan}
              onChange={(e) => onChange({ ...filters, plan: e.target.value })}
              className="w-full rounded-xl border border-slate-700/60 bg-slate-900/90 px-3 py-2 text-xs text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 motion-safe:transition-all cursor-pointer"
            >
              {PLAN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <label htmlFor="filter-status" className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1">
              <ShieldAlert size={12} className="text-amber-400" />
              <span>Account Status</span>
            </label>
            <select
              id="filter-status"
              value={filters.status}
              onChange={(e) => onChange({ ...filters, status: e.target.value })}
              className="w-full rounded-xl border border-slate-700/60 bg-slate-900/90 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 motion-safe:transition-all cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
