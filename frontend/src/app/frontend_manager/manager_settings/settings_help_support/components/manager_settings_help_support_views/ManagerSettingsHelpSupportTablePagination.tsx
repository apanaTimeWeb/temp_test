'use client';

interface ManagerSettingsHelpSupportTablePaginationProps {
  totalRows: number;
  startItem: number;
  endItem: number;
  effectivePage: number;
  pageCount: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  setPage: (updater: number | ((prev: number) => number)) => void;
}

/** Pagination footer bar for Help & Support tickets table. */
export function ManagerSettingsHelpSupportTablePagination({
  totalRows,
  startItem,
  endItem,
  effectivePage,
  pageCount,
  pageSize,
  setPageSize,
  setPage,
}: ManagerSettingsHelpSupportTablePaginationProps) {
  if (totalRows <= 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
      <span>
        Showing {startItem}–{endItem} of {totalRows} results
      </span>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <label htmlFor="rows-per-page-settings-help-support" className="text-xs text-secondary whitespace-nowrap">
            Rows per page:
          </label>
          <select
            id="rows-per-page-settings-help-support"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
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
            onClick={() => setPage((current) => Math.max(0, current - 1))}
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
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
