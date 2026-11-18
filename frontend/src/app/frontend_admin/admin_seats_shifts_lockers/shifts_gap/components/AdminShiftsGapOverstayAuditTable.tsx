'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import {
  TrendingDown,
  Building2,
  Clock,
  Armchair,
  IndianRupee,
  Sparkles,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
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
    totalSeats: 40,
    assignedSeats: 22,
    gapSeats: 18,
    gapPercent: 45,
    dailyGapLoss: 420,
    monthlyLeakage: 12600,
    recommendation: 'Launch promotional 20% discount coupon for post-lunch college students',
    priority: 'High',
  },
  {
    id: 'gap-002',
    branchName: 'Downtown Central',
    shiftName: 'Night Owl Slot',
    timings: '10:00 PM – 06:00 AM',
    totalSeats: 30,
    assignedSeats: 19,
    gapSeats: 11,
    gapPercent: 37,
    dailyGapLoss: 385,
    monthlyLeakage: 11550,
    recommendation: 'Offer free tea/coffee perk to increase night exam prep retention',
    priority: 'Medium',
  },
  {
    id: 'gap-003',
    branchName: 'Westside Branch',
    shiftName: 'Morning Early Bird',
    timings: '06:00 AM – 12:00 PM',
    totalSeats: 35,
    assignedSeats: 18,
    gapSeats: 17,
    gapPercent: 49,
    dailyGapLoss: 450,
    monthlyLeakage: 13500,
    recommendation: 'Target CA/UPSC aspirants with early morning silent study campaigns',
    priority: 'High',
  },
  {
    id: 'gap-004',
    branchName: 'Westside Branch',
    shiftName: 'Afternoon Slot',
    timings: '12:00 PM – 05:00 PM',
    totalSeats: 35,
    assignedSeats: 24,
    gapSeats: 11,
    gapPercent: 31,
    dailyGapLoss: 275,
    monthlyLeakage: 8250,
    recommendation: 'Combine with Evening slot for multi-shift discount package',
    priority: 'Medium',
  },
  {
    id: 'gap-005',
    branchName: 'North Hub',
    shiftName: 'Evening Rush',
    timings: '05:00 PM – 10:00 PM',
    totalSeats: 30,
    assignedSeats: 26,
    gapSeats: 4,
    gapPercent: 13,
    dailyGapLoss: 120,
    monthlyLeakage: 3600,
    recommendation: 'Near-optimal occupancy. Enable waitlist buffer to backfill last 4 seats',
    priority: 'Low',
  },
  {
    id: 'gap-006',
    branchName: 'North Hub',
    shiftName: 'Night Slot',
    timings: '10:00 PM – 06:00 AM',
    totalSeats: 30,
    assignedSeats: 14,
    gapSeats: 16,
    gapPercent: 53,
    dailyGapLoss: 510,
    monthlyLeakage: 15300,
    recommendation: 'Low overnight demand in residential zone. Consider adjusting timings to 08 PM - 02 AM',
    priority: 'High',
  },
];

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
      const matchSearch = !q || r.shiftName.toLowerCase().includes(q) || r.branchName.toLowerCase().includes(q) || r.recommendation.toLowerCase().includes(q);
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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingDown size={18} className="text-rose-400" />
            Branch Shift Gap & Idle Capacity Breakdown
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit of unoccupied seats during shift hours and potential monthly revenue leakage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300">
            <IndianRupee size={13} />
            Total Revenue Opportunity: ₹{totalMonthlyLeakage.toLocaleString('en-IN')}/mo
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Branch</th>
              <th className="py-3 px-3">Shift Window</th>
              <th className="py-3 px-3 text-center">Capacity</th>
              <th className="py-3 px-3 text-center">Filled</th>
              <th className="py-3 px-3 text-center">Idle Gap</th>
              <th className="py-3 px-3">Gap Occupancy</th>
              <th className="py-3 px-3 text-right">Daily Loss</th>
              <th className="py-3 px-3 text-right">Monthly Leakage</th>
              <th className="py-3 px-3">Strategy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {paginated.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-3 font-medium whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Building2 size={13} className="text-indigo-400 shrink-0" />
                    <span className="text-white font-semibold">{r.branchName}</span>
                  </div>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="font-semibold text-white">{r.shiftName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{r.timings}</div>
                </td>
                <td className="py-3 px-3 text-center font-mono">{r.totalSeats}</td>
                <td className="py-3 px-3 text-center font-mono text-emerald-400 font-semibold">{r.assignedSeats}</td>
                <td className="py-3 px-3 text-center font-mono text-rose-400 font-bold">{r.gapSeats}</td>
                <td className="py-3 px-3 min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          r.gapPercent > 40 ? 'bg-rose-500' : r.gapPercent > 25 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${r.gapPercent}%` }}
                      />
                    </div>
                    <span className="font-mono text-[11px] text-slate-300 shrink-0 font-semibold">{r.gapPercent}%</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-300">₹{r.dailyGapLoss}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-rose-400">
                  ₹{r.monthlyLeakage.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 min-w-[200px]">
                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                    {r.recommendation}
                  </p>
                </td>
              </tr>
            ))}
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
