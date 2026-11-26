'use client';
// RESPONSIBILITY: Render tabular resource usage records focusing on essential metrics with Cyber-Luxury styling.

import React from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { UsageReportTableRecord } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/types/SuperadminAnalyticsUsageReportsTypes';
import { formatUsageNumber, formatStorageSize } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/utils/SuperadminAnalyticsUsageReportsFormatters';
import { SuperadminAnalyticsUsageReportsEmptyState } from '@/app/frontend_superadmin/superadmin_analytics/analytics_usage_reports/components/SuperadminAnalyticsUsageReportsEmptyState';

interface Props {
  records: UsageReportTableRecord[];
  isLoading: boolean;
  selectedRecord: UsageReportTableRecord | null;
  onSelectRecord: (record: UsageReportTableRecord) => void;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function SuperadminAnalyticsUsageReportsTable({
  records,
  isLoading,
  selectedRecord,
  onSelectRecord,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}: Props) {
  if (records.length === 0 && !isLoading) {
    return <SuperadminAnalyticsUsageReportsEmptyState />;
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div
      className="rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-md overflow-hidden shadow-2xl shadow-indigo-950/40"
      data-testid="usage-reports-table-container"
    >
      {/* ── Table Header Banner ── */}
      <div className="p-4 sm:p-5 border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/40">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <span>Library Resource Consumption & Usage</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold">
              {records.length} accounts
            </span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Key telemetry of members, cloud storage, and operating status</p>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Page <span className="text-white font-semibold">{currentPage}</span> of <span className="text-white font-semibold">{totalPages}</span>
        </span>
      </div>

      {/* ── Focused Essential Columns Table ── */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs" data-testid="usage-reports-table">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-indigo-500/20 font-bold">
              <th className="py-3.5 px-4">Library & Branch</th>
              <th className="py-3.5 px-4">Subscription Plan</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Registered Members</th>
              <th className="py-3.5 px-4 text-right">Cloud Storage</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/10">
            {records.map((r) => {
              const isSelected = selectedRecord?.id === r.id;

              return (
                <tr
                  key={r.id}
                  className={`hover:bg-indigo-500/10 transition-colors ${
                    isSelected ? 'bg-emerald-500/10' : ''
                  }`}
                >
                  {/* Library & Branch */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-bold text-white leading-tight">{r.libraryName}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-emerald-400 font-semibold">{r.libraryCode}</span>
                        <span>•</span>
                        <span>{r.branchName}</span>
                      </p>
                    </div>
                  </td>

                  {/* Plan */}
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-200">{r.plan}</span>
                  </td>

                  {/* Operating Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${
                        r.status === 'ACTIVE'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : r.status === 'SUSPENDED'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  {/* Members */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-xs whitespace-nowrap">
                    {formatUsageNumber(r.membersCount)}
                  </td>

                  {/* Storage */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-purple-400 text-xs whitespace-nowrap">
                    {formatStorageSize(r.storageMb)}
                  </td>

                  {/* Action: View full telemetry in popup */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectRecord(r)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-indigo-500/30 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 hover:text-white motion-safe:transition-all cursor-pointer shadow-xs active:scale-95"
                      title="Inspect library usage details"
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Table Footer & Pagination ── */}
      <div className="p-3.5 border-t border-indigo-500/20 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Showing <span className="text-white font-medium">{records.length}</span> of <span className="text-white font-medium">{totalCount}</span> monitored library accounts
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-xl border border-indigo-500/25 bg-slate-900/80 hover:bg-indigo-500/20 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer motion-safe:transition-all"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/25 font-bold font-mono text-white text-xs">
            {currentPage}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-xl border border-indigo-500/25 bg-slate-900/80 hover:bg-indigo-500/20 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer motion-safe:transition-all"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
