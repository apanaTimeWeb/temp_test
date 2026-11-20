'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function SuperadminSystemHealthOverviewServicesPagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-border/80 bg-slate-900/40 text-xs text-slate-400">
      <div className="flex items-center gap-3">
        <span>
          {totalItems === 0
            ? 'Showing 0 services'
            : `Showing ${page * pageSize + 1} to ${Math.min((page + 1) * pageSize, totalItems)} of ${totalItems} services`}
        </span>
        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-[11px] text-slate-500">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-border/80 bg-slate-900 px-2 py-0.5 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all cursor-pointer"
          disabled={page === 0}
          onClick={() => onPageChange(Math.max(0, page - 1))}
        >
          <ChevronLeft size={14} />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onPageChange(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                page === idx ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all cursor-pointer"
          disabled={page + 1 >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
