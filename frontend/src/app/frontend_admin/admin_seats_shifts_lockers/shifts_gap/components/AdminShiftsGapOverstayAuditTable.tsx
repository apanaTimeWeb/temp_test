'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import {
  TrendingDown,
  Building2,
  Clock,
  Armchair,
  IndianRupee,
  Sparkles,
  Search,
  Filter,
  Lightbulb,
} from 'lucide-react';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';

interface ShiftGapAuditRecord {
  id: string;
  branchName: string;
  shiftName: string;
  timings: string;
  totalSeats: number;
  assignedSeats: number;
  gapSeats: number;
  gapPercent: number;
  dailyGapLoss: number;
  monthlyLeakage: number;
  recommendation: string;
  priority: 'High' | 'Medium' | 'Low';
}

const DEMO_GAP_RECORDS: ShiftGapAuditRecord[] = [
  {
    id: 'gap-001',
    branchName: 'Downtown Central',
    shiftName: 'Afternoon Flexi',
    timings: '12:00 PM – 05:00 PM',
    totalSeats: 24,
    assignedSeats: 14,
    gapSeats: 10,
    gapPercent: 42,
    dailyGapLoss: 350,
    monthlyLeakage: 10500,
    recommendation: 'Launch promotional 20% discount coupon for post-lunch college students',
    priority: 'High',
  },
  {
    id: 'gap-002',
    branchName: 'Downtown Central',
    shiftName: 'Night Owl Slot',
    timings: '10:00 PM – 06:00 AM',
    totalSeats: 24,
    assignedSeats: 16,
    gapSeats: 8,
    gapPercent: 33,
    dailyGapLoss: 320,
    monthlyLeakage: 9600,
    recommendation: 'Offer free night beverages & high-speed backup to retain competitive exam night batches',
    priority: 'Medium',
  },
  {
    id: 'gap-003',
    branchName: 'Westside Branch',
    shiftName: 'Morning Early Bird',
    timings: '07:00 AM – 12:00 PM',
    totalSeats: 12,
    assignedSeats: 6,
    gapSeats: 6,
    gapPercent: 50,
    dailyGapLoss: 210,
    monthlyLeakage: 6300,
    recommendation: 'Target CA / UPSC aspirants with early morning silent study campaigns',
    priority: 'High',
  },
  {
    id: 'gap-004',
    branchName: 'Westside Branch',
    shiftName: 'Afternoon Slot',
    timings: '12:00 PM – 05:00 PM',
    totalSeats: 12,
    assignedSeats: 8,
    gapSeats: 4,
    gapPercent: 33,
    dailyGapLoss: 140,
    monthlyLeakage: 4200,
    recommendation: 'Combine with Evening slot for multi-shift discount package',
    priority: 'Medium',
  },
  {
    id: 'gap-005',
    branchName: 'North Hub',
    shiftName: 'Evening Rush',
    timings: '05:00 PM – 10:00 PM',
    totalSeats: 12,
    assignedSeats: 10,
    gapSeats: 2,
    gapPercent: 17,
    dailyGapLoss: 90,
    monthlyLeakage: 2700,
    recommendation: 'Near-optimal occupancy. Enable waitlist buffer to backfill remaining 2 seats',
    priority: 'Low',
  },
  {
    id: 'gap-006',
    branchName: 'North Hub',
    shiftName: 'Early Morning',
    timings: '06:00 AM – 11:00 AM',
    totalSeats: 12,
    assignedSeats: 5,
    gapSeats: 7,
    gapPercent: 58,
    dailyGapLoss: 245,
    monthlyLeakage: 7350,
    recommendation: 'Low early morning walk-ins near campus. Partner with nearby coaching institutes',
    priority: 'High',
  },
];

function getBranchBadgeClass(branch: string) {
  const lower = branch.toLowerCase();
  if (lower.includes('downtown')) return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300';
  if (lower.includes('westside')) return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
  if (lower.includes('north')) return 'border-purple-500/30 bg-purple-500/10 text-purple-300';
  return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';
}

export function AdminShiftsGapOverstayAuditTable() {
  const { selectedBranch, isAllBranches } = useAdminBranch();
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (isAllBranches || !selectedBranch) {
      setBranchFilter('ALL');
    } else {
      setBranchFilter(selectedBranch.name);
    }
  }, [selectedBranch, isAllBranches]);

  const filteredRecords = useMemo(() => {
    return DEMO_GAP_RECORDS.filter((r) => {
      const matchBranch = branchFilter === 'ALL' || r.branchName.toLowerCase().includes(branchFilter.toLowerCase());
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        r.shiftName.toLowerCase().includes(q) ||
        r.branchName.toLowerCase().includes(q) ||
        r.recommendation.toLowerCase().includes(q);
      return matchBranch && matchSearch;
    });
  }, [branchFilter, searchQuery]);

  const paginated = useMemo(() => {
    return filteredRecords.slice(page * pageSize, (page + 1) * pageSize);
  }, [filteredRecords, page, pageSize]);

  const totalMonthlyLeakage = useMemo(() => {
    return filteredRecords.reduce((acc, r) => acc + r.monthlyLeakage, 0);
  }, [filteredRecords]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingDown size={19} className="text-rose-400" />
            Branch Shift Gap & Idle Capacity Breakdown
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit of unoccupied seats during shift hours and potential monthly revenue opportunity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-bold text-rose-300 shadow-xs">
            <IndianRupee size={13} />
            Total Monthly Gap Opportunity: ₹{totalMonthlyLeakage.toLocaleString('en-IN')}/mo
          </span>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search shift, branch, or monetization strategy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={13} className="text-slate-400" />
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer font-medium"
            aria-label="Filter gap table by branch"
          >
            <option value="ALL">All Branches</option>
            <option value="Downtown Central">Downtown Central</option>
            <option value="Westside Branch">Westside Branch</option>
            <option value="North Hub">North Hub</option>
          </select>
        </div>
      </div>

      {/* High-Contrast Non-Overlapping Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3.5">Branch</th>
              <th className="py-3 px-3.5">Shift Window</th>
              <th className="py-3 px-3 text-center">Capacity</th>
              <th className="py-3 px-3 text-center">Filled</th>
              <th className="py-3 px-3 text-center">Idle Gap</th>
              <th className="py-3 px-3.5 min-w-[130px]">Gap %</th>
              <th className="py-3 px-3.5 text-right">Daily Loss</th>
              <th className="py-3 px-3.5 text-right">Monthly Leakage</th>
              <th className="py-3 px-4 min-w-[220px]">Monetization Strategy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500">
                  No shift gap records match this filter.
                </td>
              </tr>
            ) : (
              paginated.map((r) => {
                const branchBadge = getBranchBadgeClass(r.branchName);
                return (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3.5 font-medium whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-semibold text-[11px] ${branchBadge}`}>
                        <Building2 size={11} className="shrink-0" />
                        <span>{r.branchName}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-bold text-white">{r.shiftName}</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <Clock size={11} className="text-cyan-400" />
                        <span>{r.timings}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-300">{r.totalSeats}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">{r.assignedSeats}</td>
                    <td className="py-3 px-3 text-center font-mono font-extrabold text-rose-400">{r.gapSeats}</td>
                    <td className="py-3 px-3.5 min-w-[130px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              r.gapPercent > 40 ? 'bg-rose-500' : r.gapPercent > 25 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${r.gapPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-300 shrink-0 font-bold">{r.gapPercent}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-slate-300 font-medium">₹{r.dailyGapLoss}</td>
                    <td className="py-3 px-3.5 text-right font-mono font-extrabold text-rose-400">
                      ₹{r.monthlyLeakage.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 min-w-[220px]">
                      <div className="flex items-start gap-1.5 text-[11px] text-slate-300 leading-snug">
                        <Lightbulb size={13} className="text-amber-400 shrink-0 mt-0.5" />
                        <span>{r.recommendation}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AdminTablePagination
        page={page}
        pageSize={pageSize}
        totalRows={filteredRecords.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

export default AdminShiftsGapOverstayAuditTable;
