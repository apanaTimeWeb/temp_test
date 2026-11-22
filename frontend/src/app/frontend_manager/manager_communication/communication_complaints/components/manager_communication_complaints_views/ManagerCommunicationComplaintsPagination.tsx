'use client';

import React from 'react';

export interface ManagerCommunicationComplaintsPaginationProps {
  totalRows: number;
  startItem: number;
  endItem: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  effectivePage: number;
  pageCount: number;
  setPage: (updater: number | ((prev: number) => number)) => void;
}

export function ManagerCommunicationComplaintsPagination({
  totalRows,
  startItem,
  endItem,
  pageSize,
  setPageSize,
  effectivePage,
  pageCount,
  setPage,
}: ManagerCommunicationComplaintsPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 py-3 border-t border-border text-xs text-secondary">
      <div>
        Showing {totalRows === 0 ? 0 : startItem}–{endItem} of {totalRows} complaints
      </div>
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(0);
          }}
          className="mgr-select text-xs py-1 px-2"
        >
          {[5, 10, 20, 50].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1 ml-2">
          <button
            type="button"
            disabled={effectivePage <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-2 py-1 rounded border border-border disabled:opacity-40 hover:bg-surface-hover cursor-pointer"
          >
            Previous
          </button>
          <span className="px-2 font-mono">
            {effectivePage + 1} / {Math.max(1, pageCount)}
          </span>
          <button
            type="button"
            disabled={effectivePage + 1 >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="px-2 py-1 rounded border border-border disabled:opacity-40 hover:bg-surface-hover cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
