'use client';
// RESPONSIBILITY: Render tabular resource usage records across libraries and branches with pagination and status indicators.

import React from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { UsageReportTableRecord } from '../types/SuperadminAnalyticsUsageReportsTypes';
import { formatUsageNumber, formatStorageSize } from '../utils/SuperadminAnalyticsUsageReportsFormatters';
import { SuperadminAnalyticsUsageReportsEmptyState } from './SuperadminAnalyticsUsageReportsEmptyState';

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
      <div className="p-4 sm:p-5 border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/40">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <span>Library Resource Consumption & Usage</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold">
              {records.length} accounts
            </span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Live telemetry of members, staff quotas, storage, API ingress, and messaging</p>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Page <span className="text-white font-semibold">{currentPage}</span> of <span className="text-white font-semibold">{totalPages}</span>
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs" data-testid="usage-reports-table">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-indigo-500/20 font-bold">
              <th className="py-3.5 px-4">Library / Branch</th>
              <th className="py-3.5 px-4">Plan & Status</th>
              <th className="py-3.5 px-4 text-right">Members</th>
              <th className="py-3.5 px-4 text-right">Staff</th>
              <th className="py-3.5 px-4 text-right">Storage</th>
              <th className="py-3.5 px-4 text-right">API Calls</th>
              <th className="py-3.5 px-4 text-right">SMS / WhatsApp</th>
              <th className="py-3.5 px-4 text-center">Action</th>
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
                      <p className="font-bold text-white">{r.libraryName}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-emerald-400 font-semibold">{r.libraryCode}</span>
                        <span>•</span>
                        <span>{r.branchName}</span>
                      </p>
                    </div>
                  </td>

                  {/* Plan & Status */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <p className="font-medium text-slate-200">{r.plan}</p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'ACTIVE'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : r.status === 'SUSPENDED'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {r.status}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            r.paymentStatus === 'PAID'
                              ? 'text-emerald-400'
                              : r.paymentStatus === 'OVERDUE'
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {r.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Members */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-bold text-white font-mono">{formatUsageNumber(r.membersCount)}</span>
                  </td>

                  {/* Staff */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-medium text-slate-300 font-mono">{r.staffCount}</span>
                  </td>

                  {/* Storage */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono font-bold text-purple-400">
                      {formatStorageSize(r.storageMb)}
                    </span>
                  </td>

                  {/* API Calls */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono text-slate-400">
                      {formatUsageNumber(r.apiCalls)}
                    </span>
                  </td>

                  {/* SMS / WhatsApp */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="text-[11px] font-mono">
                      <span className="font-medium text-slate-200">{formatUsageNumber(r.smsCount)} SMS</span>
                      <span className="text-slate-500"> / </span>
                      <span className="font-medium text-emerald-400">{formatUsageNumber(r.whatsappCount)} WA</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectRecord(r)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-indigo-500/30 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
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
            className="p-1.5 rounded-xl border border-indigo-500/25 bg-slate-900/80 hover:bg-indigo-500/20 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
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
            className="p-1.5 rounded-xl border border-indigo-500/25 bg-slate-900/80 hover:bg-indigo-500/20 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
