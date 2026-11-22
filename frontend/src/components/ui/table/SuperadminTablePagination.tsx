'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SuperadminTablePaginationProps {
  page: number; // 0-indexed
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  pageSizeOptions?: readonly number[];
  itemLabel?: string;
}

export function SuperadminTablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  itemLabel = 'records',
}: SuperadminTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const effectivePage = Math.min(Math.max(0, page), totalPages - 1);
  const startItem = totalItems === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-indigo-500/20 bg-slate-950/60 text-xs text-slate-400">
      <div className="flex items-center gap-3">
        <span>
          {totalItems === 0
            ? `Showing 0 ${itemLabel}`
            : `Showing ${startItem}–${endItem} of ${totalItems} ${itemLabel}`}
        </span>
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-[11px] text-slate-500">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(0);
              }}
              className="rounded-lg border border-indigo-500/25 bg-slate-900 px-2 py-1 text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold transition-all cursor-pointer"
          disabled={effectivePage <= 0}
          onClick={() => onPageChange(Math.max(0, effectivePage - 1))}
        >
          <ChevronLeft size={14} />
          <span>Previous</span>
        </button>

        <span className="text-xs text-slate-400 px-1 font-mono">
          Page {effectivePage + 1} of {totalPages}
        </span>

        <button
          type="button"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold transition-all cursor-pointer"
          disabled={effectivePage >= totalPages - 1}
          onClick={() => onPageChange(Math.min(totalPages - 1, effectivePage + 1))}
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
