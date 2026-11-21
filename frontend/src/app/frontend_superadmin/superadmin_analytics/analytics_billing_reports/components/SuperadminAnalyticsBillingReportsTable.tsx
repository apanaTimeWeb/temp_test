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
    <div className="rounded-2xl border border-border bg-card/70 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-border/40 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">
          Platform Invoices & Billing Ledger ({records.length})
        </h3>
        <span className="text-xs text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" role="table">
          <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border/40">
            <tr>
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Library / Branch</th>
              <th className="py-3 px-4">Plan</th>
              <th className="py-3 px-4">Cycle</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4">Method / Txn</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {pagedRecords.map((r) => {
              const statusCfg = BILLING_PAYMENT_STATUS_COLORS[r.paymentStatus] ?? { bg: 'bg-muted', text: 'text-foreground' };

              return (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-amber-400 font-semibold">{r.invoiceNumber}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-foreground">{r.libraryName}</p>
                    <p className="text-[10px] text-muted-foreground">{r.branchName}</p>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{r.planName}</td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-[10px]">{r.billingCycle}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-foreground">
                    {formatBillingCurrency(r.amountMinor)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusCfg.bg} ${statusCfg.text}`}>
                      {r.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-foreground text-[11px]">{r.paymentMethod.replace(/_/g, ' ')}</p>
                    <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[120px]">{r.transactionId}</p>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{r.invoiceDate}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => onSelectRecord(r)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-border bg-background hover:bg-muted text-foreground transition-all cursor-pointer active:scale-95"
                      aria-label={`View invoice ${r.invoiceNumber}`}
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

      {totalPages > 1 && (
        <div className="p-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground bg-muted/20">
          <span>Showing {(currentPage - 1) * pageSize + 1} to {Math.min(count, currentPage * pageSize)} of {count}</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 font-semibold text-foreground">{currentPage}</span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
