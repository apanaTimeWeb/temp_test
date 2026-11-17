'use client';
import SuperadminLibrariesOverviewEmptyState from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/components/SuperadminLibrariesOverviewEmptyState';
/** Responsibility: Superadmin Libraries Semantic Table; renders an accessible, sortable, filterable table with responsive horizontal overflow and rich UI patterns. */
import { useTranslations } from 'next-intl';
import { type ReactNode } from 'react';
import { Search, X } from 'lucide-react';

import type { SemanticCellParams, SemanticColumnDef, SemanticTableProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewSemanticTableTypes';
import { stableRowKey } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/utils/SuperadminLibrariesOverviewStableRowKey';
import { useSuperadminLibrariesOverviewSemanticTableState } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverviewSemanticTableState';
import { displayValue } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/utils/SuperadminLibrariesOverviewDisplayValue';
export type { SemanticCellParams, SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewSemanticTableTypes';

function getColumnWidthClass(width?: number, minWidth?: number, field?: string): string {
  const key = (field ?? '').toLowerCase();
  if (/action|actions|operation|operations/.test(key)) return 'w-28';
  if (/status|role|priority|severity/.test(key)) return 'w-28';
  if (/date|time|created|updated|joined|lastactive|lastlogin/.test(key)) return 'w-32';
  if (/amount|price|revenue|mrr|balance|total|payment|students|count/.test(key)) return 'w-32 text-right';
  if (/^id$|_id$|id$|reference|ref$|txn/.test(key)) return 'w-24';
  if (/name|subject|title|description|message/.test(key)) return 'min-w-44';
  if (width !== undefined) return width <= 100 ? 'w-24' : width <= 140 ? 'w-28' : width <= 180 ? 'w-32' : 'w-48';
  if (minWidth !== undefined) return minWidth <= 100 ? 'min-w-24' : minWidth <= 140 ? 'min-w-32' : minWidth <= 180 ? 'min-w-40' : 'min-w-48';
  return 'min-w-32';
}

/**
 * Performs the superadmin libraries overview semantic table operation within libraries overview.
 */
export default function SuperadminLibrariesOverviewSemanticTable<T extends object>({
  rowData,
  columnDefs,
  pagination = false,
  paginationPageSize = 10,
  className = '',
  getRowId,
  rowClassRules,
  onRowClick,
  hideFilter = false,
  pageIndex,
  onPageChange,
}: SemanticTableProps<T>) {
  const tCopy = useTranslations('SUPERADMIN_LIBRARIES');
  const { sort, setSort, setPage, filterText, setFilterText, sortedRows, pageCount, activePage, visibleRows } = useSuperadminLibrariesOverviewSemanticTableState({ rowData, paginationPageSize, pageIndex, onPageChange, paginationEnabled: pagination });
  const columns = (columnDefs ?? []).filter((column) => !column.hide);

  return (
    <div className={`overflow-x-auto w-full min-w-0 ${className}`} role="region" aria-label={tCopy('COPY.TABLE_ARIA_LABEL')} tabIndex={0}>
      {!hideFilter && (
        <div className="flex items-center justify-end border-b border-border p-3 sm:p-4 bg-card/60">
          <label className="relative flex items-center text-sm text-secondary">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none z-10" />
            <span className="sr-only">{tCopy('COPY.TABLE_FILTER_ROWS')}</span>
            <input
              type="search"
              value={filterText}
              onChange={(event) => { setFilterText(event.currentTarget.value); setPage(0); onPageChange?.(0); }}
              placeholder="Search libraries..."
              className="w-full sm:min-w-56 pl-9 pr-8 py-1.5 rounded-xl border border-indigo-500/25 bg-input text-xs text-primary placeholder:text-secondary focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all"
              data-testid="superadmin-libraries-libraries-semantic-table-field-1"
            />
            {filterText && (
              <button
                type="button"
                onClick={() => { setFilterText(''); setPage(0); onPageChange?.(0); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-0.5"
                title="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </label>
        </div>
      )}

      <table className="sa-semantic-table w-full border-collapse text-left text-sm">
        <thead className="bg-surface-highlight text-secondary">
          <tr>
            {columns.map((column, index) => {
              const field = column.field ?? `column-${index}`;
              const canSort = column.sortable !== false && Boolean(column.field);
              const isCurrentSort = sort?.field === field;
              const ariaSort = isCurrentSort ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none';

              return (
                <th
                  key={field}
                  scope="col"
                  aria-sort={canSort ? ariaSort : undefined}
                  className={`border-b border-border px-4 py-3.5 font-semibold text-xs uppercase tracking-wider text-slate-300 ${getColumnWidthClass(column.width, column.minWidth, field)}`}
                >
                  {canSort ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-left hover:text-indigo-300 transition-colors cursor-pointer"
                      onClick={() => {
                        setSort((current) => current?.field === field ? { field, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { field, direction: 'asc' });
                        setPage(0);
                        onPageChange?.(0);
                      }}
                      aria-label={tCopy('COPY.TABLE_SORT_BY', { column: column.headerName ?? field })}
                      data-testid={`superadmin-libraries-libraries-semantic-table-table-sort-by-2-${String(field)}`}
                    >
                      <span>{column.headerName ?? field}</span>
                      <span className="text-indigo-400 font-bold">{sort?.field === field ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ''}</span>
                    </button>
                  ) : (
                    column.headerName ?? field
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visibleRows.length === 0 ? (
            <tr>
              <td colSpan={Math.max(1, columns.length)} className="px-4 py-10 text-center text-secondary" role="status">
                <SuperadminLibrariesOverviewEmptyState filtered={(rowData?.length ?? 0) !== 0 && Boolean(filterText.trim())} />
              </td>
            </tr>
          ) : (
            visibleRows.map((row: T) => (
              <tr
                key={getRowId ? getRowId({ data: row }) : stableRowKey(row)}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(event) => {
                  if (onRowClick && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    onRowClick(row);
                  }
                }}
                tabIndex={onRowClick ? 0 : undefined}
                className={`border-b border-border last:border-b-0 hover:bg-surface-hover transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${Object.entries(rowClassRules ?? {}).filter(([, matches]) => matches({ data: row })).map(([className]) => className).join(' ')}`}
                data-testid="superadmin-superadmin-libraries-overview-semantic-table-tr-line-43"
              >
                {columns.map((column, index) => {
                  const field = column.field ?? `column-${index}`;
                  const raw = column.valueGetter ? column.valueGetter({ data: row, value: undefined, colDef: { field } }) : (row as unknown as Record<string, unknown>)[field];
                  const value = typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean' ? raw : raw == null ? undefined : String(raw);
                  const content = column.cellRenderer ? (column.cellRenderer as unknown as (params: SemanticCellParams<T>) => ReactNode)({ data: row, value, colDef: { field } }) : column.valueFormatter ? column.valueFormatter({ data: row, value, colDef: { field } }) : value;
                  const cellClass = typeof column.cellClass === 'function' ? column.cellClass() : column.cellClass;

                  return (
                    <td key={field} data-label={column.headerName ?? field} className={`px-4 py-3.5 align-middle ${cellClass ?? ''}`}>
                      {typeof content === 'boolean' ? tCopy(content ? 'COPY.BOOLEAN_YES' : 'COPY.BOOLEAN_NO') : displayValue(content as ReactNode)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-border bg-card/60 text-xs text-secondary">
          <span>
            {sortedRows.length === 0
              ? tCopy('COPY.TABLE_ROWS_ZERO')
              : tCopy('COPY.TABLE_ROWS_RANGE', { start: activePage * paginationPageSize + 1, end: Math.min((activePage + 1) * paginationPageSize, sortedRows.length), total: sortedRows.length })}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-600/30 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-medium"
              disabled={activePage === 0}
              onClick={() => { const nextPage = Math.max(0, activePage - 1); setPage(nextPage); onPageChange?.(nextPage); }}
              data-testid="superadmin-libraries-libraries-semantic-table-table-previous-3"
            >
              {tCopy('COPY.TABLE_PREVIOUS')}
            </button>
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-600/30 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-medium"
              disabled={activePage + 1 >= pageCount}
              onClick={() => { const nextPage = Math.min(pageCount - 1, activePage + 1); setPage(nextPage); onPageChange?.(nextPage); }}
              data-testid="superadmin-libraries-libraries-semantic-table-table-next-4"
            >
              {tCopy('COPY.TABLE_NEXT')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
