'use client';

interface ManagerAssetsRegisterTablePaginationProps {
  totalRows: number;
  startItem: number;
  endItem: number;
  effectivePage: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newSize: number) => void;
}

export function ManagerAssetsRegisterTablePagination({
  totalRows,
  startItem,
  endItem,
  effectivePage,
  pageCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: ManagerAssetsRegisterTablePaginationProps) {
  if (totalRows <= 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-secondary bg-surface-highlight">
      <span>
        Showing <strong className="text-primary font-semibold">{startItem}</strong>–
        <strong className="text-primary font-semibold">{endItem}</strong> of{' '}
        <strong className="text-primary font-semibold">{totalRows}</strong> results
      </span>

      <div className="flex items-center gap-3">
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <label htmlFor="rows-per-page-assets-register" className="text-xs text-secondary whitespace-nowrap">
              Rows per page:
            </label>
            <select
              id="rows-per-page-assets-register"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-border bg-card px-2 py-1 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="px-2.5 py-1 rounded-lg border border-border text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed motion-safe:transition-colors"
            disabled={effectivePage <= 0}
            onClick={() => onPageChange(Math.max(0, effectivePage - 1))}
          >
            Previous
          </button>
          <span className="text-xs text-secondary px-1.5">
            Page <strong className="text-primary font-semibold">{effectivePage + 1}</strong> of{' '}
            <strong className="text-primary font-semibold">{pageCount}</strong>
          </span>
          <button
            type="button"
            className="px-2.5 py-1 rounded-lg border border-border text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed motion-safe:transition-colors"
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
