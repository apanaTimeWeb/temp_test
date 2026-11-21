'use client';
// RESPONSIBILITY: Render tabular report records with pagination and detail inspection with Cyber-Luxury styling.

import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PlatformReportTableRecord } from '../types/SuperadminAnalyticsPlatformReportsTypes';
import { PLATFORM_STATUS_COLORS, PLATFORM_PAYMENT_STATUS_COLORS } from '../constants/SuperadminAnalyticsPlatformReportsConstants';
import { SuperadminAnalyticsPlatformReportsEmptyState } from './SuperadminAnalyticsPlatformReportsEmptyState';

interface Props {
  records: PlatformReportTableRecord[];
  onSelectRecord: (record: PlatformReportTableRecord) => void;
  onResetFilters: () => void;
}

export function SuperadminAnalyticsPlatformReportsTable({ records, onSelectRecord, onResetFilters }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const pagedRecords = records.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (records.length === 0) {
    return <SuperadminAnalyticsPlatformReportsEmptyState onReset={onResetFilters} />;
  }

  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 overflow-hidden shadow-xl backdrop-blur-md">
      <div className="p-4 border-b border-indigo-500/20 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">
          Platform Directory Audit Records ({records.length})
        </h3>
        <span className="text-xs text-slate-400">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" role="table">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-indigo-500/20">
            <tr>
              <th className="py-3 px-4">Code / ID</th>
              <th className="py-3 px-4">Library Name</th>
              <th className="py-3 px-4 text-center">Branches</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Admin</th>
              <th className="py-3 px-4">Plan Tier</th>
              <th className="py-3 px-4 text-center">Account Status</th>
              <th className="py-3 px-4 text-center">Payment</th>
              <th className="py-3 px-4">Onboarded</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/10">
            {pagedRecords.map((r) => {
              const statusCfg = PLATFORM_STATUS_COLORS[r.status] ?? { bg: 'bg-muted', text: 'text-foreground' };
              const payCfg = PLATFORM_PAYMENT_STATUS_COLORS[r.paymentStatus] ?? { bg: 'bg-muted', text: 'text-foreground' };

              return (
                <tr key={r.id} className="hover:bg-indigo-500/10 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-sky-400 font-semibold">{r.libraryCode}</td>
                  <td className="py-3 px-4 font-semibold text-white">{r.libraryName}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-200">{r.branchCount}</td>
                  <td className="py-3 px-4 text-slate-400">{r.city}, {r.state}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-white">{r.adminName}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{r.adminEmail}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{r.plan}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${statusCfg.bg} ${statusCfg.text}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${payCfg.bg} ${payCfg.text}`}>
                      {r.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{r.createdDate}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectRecord(r)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 transition-all cursor-pointer active:scale-95 shadow-sm"
                      aria-label={`View details for ${r.libraryName}`}
                    >
                      <Eye size={12} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-indigo-500/20 flex items-center justify-between text-xs text-slate-400 bg-slate-950/50">
          <span>Showing {(currentPage - 1) * pageSize + 1} to {Math.min(records.length, currentPage * pageSize)} of {records.length}</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-indigo-500/30 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 font-semibold text-white">{currentPage}</span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-indigo-500/30 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
