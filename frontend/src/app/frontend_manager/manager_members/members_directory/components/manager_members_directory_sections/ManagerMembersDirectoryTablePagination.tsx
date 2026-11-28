'use client';

import { ChevronLeft,ChevronRight } from 'lucide-react';

export interface ManagerMembersDirectoryTablePaginationProps {
  startItem: number;
  endItem: number;
  totalRows: number;
  pageSize: number;
  onPageSizeChange: (newPageSize: number) => void;
  effectivePage: number;
  pageCount: number;
  onPageChange: (newPage: number) => void;
}

export function ManagerMembersDirectoryTablePagination({
  startItem,
  endItem,
  totalRows,
  pageSize,
  onPageSizeChange,
  effectivePage,
  pageCount,
  onPageChange,
}: ManagerMembersDirectoryTablePaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-3 py-3 text-sm text-secondary">
      <span>
        Showing {startItem}–{endItem} of {totalRows} results
      </span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <label htmlFor="rows-per-page-members-directory" className="text-xs text-secondary whitespace-nowrap">
            Rows per page:
          </label>
          <select
            id="rows-per-page-members-directory"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded border border-border bg-surface px-2 py-1 text-xs text-primary"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-600/30 disabled:opacity-40 motion-safe:transition-all cursor-pointer shadow-xs"
            disabled={effectivePage <= 0}
            onClick={() => onPageChange(Math.max(0, effectivePage - 1))}
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>
          <span className="text-xs text-secondary px-1 font-medium">
            Page {effectivePage + 1} of {pageCount}
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-600/30 disabled:opacity-40 motion-safe:transition-all cursor-pointer shadow-xs"
            disabled={effectivePage >= pageCount - 1}
            onClick={() => onPageChange(Math.min(pageCount - 1, effectivePage + 1))}
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

