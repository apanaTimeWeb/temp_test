'use client';
// RESPONSIBILITY: Render tabular resource usage records across libraries and branches with pagination and status indicators.

import React from 'react';
import { Eye, ChevronLeft, ChevronRight, HardDrive, Users, MessageSquare } from 'lucide-react';
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
      className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xs overflow-hidden shadow-xs"
      data-testid="usage-reports-table-container"
    >
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs" data-testid="usage-reports-table">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
              <th className="py-3 px-4">Library / Branch</th>
              <th className="py-3 px-4">Plan & Status</th>
              <th className="py-3 px-4 text-right">Members</th>
              <th className="py-3 px-4 text-right">Staff</th>
              <th className="py-3 px-4 text-right">Storage</th>
              <th className="py-3 px-4 text-right">API Calls</th>
              <th className="py-3 px-4 text-right">SMS / WhatsApp</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {records.map((r) => {
              const isSelected = selectedRecord?.id === r.id;

              return (
                <tr
                  key={r.id}
                  className={`hover:bg-muted/40 transition-colors ${
                    isSelected ? 'bg-sky-500/10' : ''
                  }`}
                >
                  {/* Library & Branch */}
                  <td className="py-3.5 px-4">
                    <div>
                      <p className="font-bold text-foreground">{r.libraryName}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-sky-400">{r.libraryCode}</span>
                        <span>•</span>
                        <span>{r.branchName}</span>
                      </p>
                    </div>
                  </td>

                  {/* Plan & Status */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{r.plan}</p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : r.status === 'SUSPENDED'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {r.status}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
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
                    <span className="font-bold text-foreground">{formatUsageNumber(r.membersCount)}</span>
                  </td>

                  {/* Staff */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-medium text-foreground">{r.staffCount}</span>
                  </td>

                  {/* Storage */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono font-bold text-purple-400">
                      {formatStorageSize(r.storageMb)}
                    </span>
                  </td>

                  {/* API Calls */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono text-muted-foreground">
                      {formatUsageNumber(r.apiCalls)}
                    </span>
                  </td>

                  {/* SMS / WhatsApp */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="text-[11px]">
                      <span className="font-medium text-foreground">{formatUsageNumber(r.smsCount)} SMS</span>
                      <span className="text-muted-foreground"> / </span>
                      <span className="font-medium text-emerald-400">{formatUsageNumber(r.whatsappCount)} WA</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectRecord(r)}
                      className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                      title="Inspect library usage details"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Table Footer & Pagination ── */}
      <div className="p-3.5 border-t border-border/40 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div>
          Showing {records.length} of {totalCount} monitored library accounts
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="px-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
