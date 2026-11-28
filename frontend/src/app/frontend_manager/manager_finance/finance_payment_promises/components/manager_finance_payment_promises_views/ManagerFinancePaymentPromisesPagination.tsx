'use client';

export interface ManagerFinancePaymentPromisesPaginationProps {
  startItem: number;
  endItem: number;
  totalRows: number;
  effectivePage: number;
  pageCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function ManagerFinancePaymentPromisesPagination({
  startItem,
  endItem,
  totalRows,
  effectivePage,
  pageCount,
  onPrevPage,
  onNextPage,
}: ManagerFinancePaymentPromisesPaginationProps) {
  if (totalRows === 0) return null;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs sm:text-sm text-secondary">
      <span>
        Showing {startItem}–{endItem} of {totalRows} promises
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={effectivePage === 0}
          onClick={onPrevPage}
          className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed motion-safe:transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
        >
          Previous
        </button>
        <span className="text-xs px-1">
          Page {effectivePage + 1} of {pageCount}
        </span>
        <button
          type="button"
          disabled={effectivePage >= pageCount - 1}
          onClick={onNextPage}
          className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed motion-safe:transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
        >
          Next
        </button>
      </div>
    </div>
  );
}
