'use client';

import React from 'react';

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
            className="mgr-btn-ghost mgr-btn-sm"
            disabled={effectivePage <= 0}
            onClick={() => onPageChange(Math.max(0, effectivePage - 1))}
          >
            Previous
          </button>
          <span className="text-xs text-secondary px-1">
            Page {effectivePage + 1} of {pageCount}
          </span>
          <button
            type="button"
            className="mgr-btn-ghost mgr-btn-sm"
            disabled={effectivePage >= pageCount - 1}
            onClick={() => onPageChange(Math.min(pageCount - 1, effectivePage + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

