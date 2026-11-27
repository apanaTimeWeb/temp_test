'use client';

import { DEMO_GAP_RECORDS } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/config/admin_shifts_gap.demo_data';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import { Building2, Clock, IndianRupee, Lightbulb, Search, TrendingDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

function getBranchBadgeClass(branch: string) {
  const lower = branch.toLowerCase();
  if (lower.includes('downtown')) return 'border-border-focus bg-primary-subtle text-primary';
  if (lower.includes('westside')) return 'border-success bg-success-bg text-success-text';
  if (lower.includes('north')) return 'border-purple-text bg-purple-bg text-purple-text';
  return 'border-info bg-info-bg text-info-text';
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
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <TrendingDown size={19} className="text-danger-text" aria-hidden="true" />
            Branch Shift Gap &amp; Idle Capacity Breakdown
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Audit of unoccupied seats during shift hours and potential monthly revenue opportunity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-danger bg-danger-bg px-3.5 py-1 text-xs font-bold text-danger-text shadow-card">
            <IndianRupee size={13} aria-hidden="true" />
            Total Monthly Gap Opportunity: ₹{totalMonthlyLeakage.toLocaleString('en-IN')}/mo
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary pointer-events-none" aria-hidden="true" />
          <input
            maxLength={100}
            type="text"
            placeholder="Search shift, branch, or monetization strategy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-input pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none"
          />
        </div>

        {!isAllBranches && selectedBranch && (
          <div className="flex items-center gap-1.5 rounded-xl border border-border-focus bg-primary-subtle px-3 py-1.5 text-xs text-primary font-semibold">
            <Building2 size={13} aria-hidden="true" />
            <span>Branch Scope: {selectedBranch.name}</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface-highlight">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-card text-text-secondary font-semibold uppercase tracking-wider">
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
          <tbody className="divide-y divide-border text-text-primary">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-text-secondary">
                  No shift gap records match this filter.
                </td>
              </tr>
            ) : (
              paginated.map((r) => {
                const branchBadge = getBranchBadgeClass(r.branchName);
                return (
                  <tr key={r.id} className="hover:bg-surface-hover motion-safe:transition-colors">
                    <td className="py-3 px-3.5 font-medium whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-semibold text-[11px] ${branchBadge}`}>
                        <Building2 size={11} className="shrink-0" aria-hidden="true" />
                        <span>{r.branchName}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-bold text-text-primary">{r.shiftName}</div>
                      <div className="text-[11px] text-text-secondary font-mono flex items-center gap-1 mt-0.5">
                        <Clock size={11} className="text-info-text" aria-hidden="true" />
                        <span>{r.timings}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-text-secondary">{r.totalSeats}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-success-text">{r.assignedSeats}</td>
                    <td className="py-3 px-3 text-center font-mono font-extrabold text-danger-text">{r.gapSeats}</td>
                    <td className="py-3 px-3.5 min-w-[130px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-card border border-border overflow-hidden">
                          <div
                            className={`h-full rounded-full motion-safe:transition-all motion-safe:duration-300 ${
                              r.gapPercent > 40 ? 'bg-danger-text' : r.gapPercent > 25 ? 'bg-warning-text' : 'bg-success-text'
                            }`}
                            style={{ width: `${r.gapPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-text-secondary shrink-0 font-bold">{r.gapPercent}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-text-secondary font-medium">₹{r.dailyGapLoss}</td>
                    <td className="py-3 px-3.5 text-right font-mono font-extrabold text-danger-text">
                      ₹{r.monthlyLeakage.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 min-w-[220px]">
                      <div className="flex items-start gap-1.5 text-[11px] text-text-secondary leading-snug">
                        <Lightbulb size={13} className="text-warning-text shrink-0 mt-0.5" aria-hidden="true" />
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
