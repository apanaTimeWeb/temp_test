'use client';
// Responsibility: reusable, accessible table pagination bar complying with Section 5b specification.

export interface AdminTablePaginationProps {
  page: number; // 0-indexed
  pageSize: number;
  totalRows?: number;
  totalCount?: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  pageSizeOptions?: readonly number[];
  id?: string;
  labels?: {
    showing?: string;
    of?: string;
    results?: string;
    rowsPerPage?: string;
    previous?: string;
    next?: string;
    page?: string;
  };
}

export function AdminTablePagination({
  page,
  pageSize,
  totalRows,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  id = 'admin-table-page-size',
  labels,
}: AdminTablePaginationProps) {
  const total = totalRows ?? totalCount ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const effectivePage = Math.min(Math.max(0, page), pageCount - 1);
  const startItem = total === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, total);

  const txtShowing = labels?.showing ?? 'Showing';
  const txtOf = labels?.of ?? 'of';
  const txtResults = labels?.results ?? 'results';
  const txtRowsPerPage = labels?.rowsPerPage ?? 'Rows per page:';
  const txtPrevious = labels?.previous ?? 'Previous';
  const txtNext = labels?.next ?? 'Next';
  const txtPage = labels?.page ?? 'Page';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-text-secondary">
      <span>
        {txtShowing} {startItem}–{endItem} {txtOf} {total} {txtResults}
      </span>
      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <label htmlFor={id} className="text-xs text-text-secondary whitespace-nowrap">
              {txtRowsPerPage}
            </label>
            <select
              id={id}
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(0);
              }}
              className="rounded border border-border bg-input px-2 py-1 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="min-h-9 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-text-disabled"
            disabled={effectivePage <= 0}
            onClick={() => onPageChange(Math.max(0, effectivePage - 1))}
          >
            {txtPrevious}
          </button>
          <span className="text-xs text-text-secondary">
            {txtPage} {effectivePage + 1} {txtOf} {pageCount}
          </span>
          <button
            type="button"
            className="min-h-9 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-text-disabled"
            disabled={effectivePage >= pageCount - 1}
            onClick={() => onPageChange(Math.min(pageCount - 1, effectivePage + 1))}
          >
            {txtNext}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminTablePagination;
