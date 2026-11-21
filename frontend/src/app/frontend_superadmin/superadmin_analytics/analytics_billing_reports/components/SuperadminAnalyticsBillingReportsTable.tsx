'use client';
// RESPONSIBILITY: Render tabular billing invoice records with status badges and detail actions.

import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { BillingReportTableRecord } from '../types/SuperadminAnalyticsBillingReportsTypes';
import { BILLING_PAYMENT_STATUS_COLORS } from '../constants/SuperadminAnalyticsBillingReportsConstants';
import { formatBillingCurrency } from '../utils/SuperadminAnalyticsBillingReportsFormatters';
import { SuperadminAnalyticsBillingReportsEmptyState } from './SuperadminAnalyticsBillingReportsEmptyState';

interface Props {
  records: BillingReportTableRecord[];
  isLoading?: boolean;
  selectedRecord?: BillingReportTableRecord | null;
  onSelectRecord: (record: BillingReportTableRecord) => void;
  onResetFilters?: () => void;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export function SuperadminAnalyticsBillingReportsTable({
  records,
  isLoading,
  selectedRecord,
  onSelectRecord,
  onResetFilters,
  totalCount,
  currentPage: controlledPage,
  pageSize: controlledPageSize,
  onPageChange,
}: Props) {
  const [internalPage, setInternalPage] = useState(1);
  const pageSize = controlledPageSize ?? 10;
  const currentPage = controlledPage ?? internalPage;
  const count = totalCount ?? records.length;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const pagedRecords = controlledPage ? records : records.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  if (records.length === 0 && !isLoading) {
    return <SuperadminAnalyticsBillingReportsEmptyState onReset={onResetFilters} />;
  }

  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-[#0a0d24]/90 backdrop-blur-md overflow-hidden shadow-2xl shadow-indigo-950/40">
      <div className="p-4 sm:p-5 border-b border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/40">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <span>Platform Invoices & Billing Ledger</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-semibold">
              {records.length} records
            </span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Real-time payment settlements, SaaS invoices, and subscription collections</p>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Page <span className="text-white font-semibold">{currentPage}</span> of <span className="text-white font-semibold">{totalPages}</span>
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs" role="table">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-indigo-500/20 font-bold">
            <tr>
              <th className="py-3.5 px-4">Invoice #</th>
              <th className="py-3.5 px-4">Library / Branch</th>
              <th className="py-3.5 px-4">Plan</th>
              <th className="py-3.5 px-4">Cycle</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4">Method / Txn</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-500/10">
            {pagedRecords.map((r) => {
              const statusCfg = BILLING_PAYMENT_STATUS_COLORS[r.paymentStatus] ?? { bg: 'bg-slate-800 text-slate-300' };
              const isSelected = selectedRecord?.id === r.id;

              return (
                <tr
                  key={r.id}
                  className={`hover:bg-indigo-500/10 transition-colors ${
                    isSelected ? 'bg-amber-500/10' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono text-[11px] text-amber-400 font-bold">{r.invoiceNumber}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white">{r.libraryName}</p>
                    <p className="text-[10px] text-slate-400">{r.branchName}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{r.planName}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[10px] uppercase">{r.billingCycle}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 text-xs">
                    {formatBillingCurrency(r.amountMinor)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${statusCfg.bg} ${statusCfg.text}`}>
                      {r.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-200 text-[11px] font-medium">{r.paymentMethod.replace(/_/g, ' ')}</p>
                    <p className="text-[10px] font-mono text-slate-500 truncate max-w-[120px]">{r.transactionId}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">{r.invoiceDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectRecord(r)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-indigo-500/30 bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
                      aria-label={`View invoice ${r.invoiceNumber}`}
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

      {totalPages > 1 && (
        <div className="p-3.5 border-t border-indigo-500/20 flex items-center justify-between text-xs text-slate-400 bg-slate-950/40">
          <span>
            Showing <span className="text-white font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="text-white font-medium">{Math.min(count, currentPage * pageSize)}</span> of{' '}
            <span className="text-white font-medium">{count}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className="p-1.5 rounded-xl border border-indigo-500/25 bg-slate-900/80 hover:bg-indigo-500/20 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
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
