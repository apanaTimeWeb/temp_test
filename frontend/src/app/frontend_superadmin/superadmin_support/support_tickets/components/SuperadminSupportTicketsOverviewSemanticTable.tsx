'use client';
import SuperadminSupportTicketsOverviewEmptyState from '@/app/frontend_superadmin/superadmin_support/support_tickets/components/SuperadminSupportTicketsOverviewEmptyState';
/** Responsibility: Superadmin Support Tickets Semantic Table; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSupportTicketsOverviewSemanticTable formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { useTranslations } from 'next-intl';
import { type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';

import type { SemanticCellParams, SemanticColumnDef, SemanticTableProps } from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewSemanticTableTypes';
import { stableRowKey } from '@/app/frontend_superadmin/superadmin_support/support_tickets/utils/SuperadminSupportTicketsOverviewStableRowKey';
import { useSuperadminSupportTicketsOverviewSemanticTableState } from '@/app/frontend_superadmin/superadmin_support/support_tickets/hooks/useSuperadminSupportTicketsOverviewSemanticTableState';
import { displayValue } from '@/app/frontend_superadmin/superadmin_support/support_tickets/utils/SuperadminSupportTicketsOverviewDisplayValue';
export type { SemanticCellParams, SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewSemanticTableTypes';

function getColumnWidthClass(width?: number, minWidth?: number, field?: string): string {
  const key = (field ?? '').toLowerCase();
  if (/action|actions|operation|operations/.test(key)) return 'w-36 min-w-[125px] text-right';
  if (/status|role/.test(key)) return 'w-24 min-w-[90px] text-center';
  if (/priority|severity/.test(key)) return 'w-24 min-w-[85px] text-center';
  if (/date|time|created|updated|joined|lastactive|lastlogin|age/.test(key)) return 'w-20 min-w-[65px] text-center';
  if (/amount|price|revenue|mrr|balance|total|payment|students|count/.test(key)) return 'w-28 text-right';
  if (/^id$|_id$|id$|reference|ref$|txn/.test(key)) return 'w-24 text-left';
  if (/name|subject|title|description|message/.test(key)) return 'min-w-[160px] max-w-[320px] text-left';
  if (width !== undefined) return width <= 100 ? 'w-20' : width <= 140 ? 'w-28' : width <= 180 ? 'w-36' : 'w-44';
  if (minWidth !== undefined) return minWidth <= 100 ? 'min-w-20' : minWidth <= 140 ? 'min-w-28' : minWidth <= 180 ? 'min-w-36' : 'min-w-44';
  return 'min-w-24';
}

/**
 * Performs the superadmin support tickets overview semantic table operation within support tickets; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SemanticTableProps<T>.
 */
export default function SuperadminSupportTicketsOverviewSemanticTable<T extends object>({
  rowData,
  sourceRowCount,
  columnDefs,
  pagination = false,
  paginationPageSize = 10,
  className = '',
  getRowId,
  rowClassRules,
  hideFilter = false,
  onRowClick,
  pageIndex,
  onPageChange,
}: SemanticTableProps<T>) {
  const tCopy = useTranslations('SUPERADMIN_SUPPORT_TICKETS');
  const { sort, setSort, setPage, filterText, setFilterText, sortedRows, pageCount, activePage, visibleRows } =
    useSuperadminSupportTicketsOverviewSemanticTableState({
      rowData,
      paginationPageSize,
      pageIndex,
      onPageChange,
      paginationEnabled: pagination,
      filterEnabled: !hideFilter,
    });
  const columns = (columnDefs ?? []).filter((column) => !column.hide);

  return (
    <div className={`overflow-x-auto w-full ${className}`} role="region" aria-label={tCopy('COPY.TABLE_ARIA_LABEL')} tabIndex={0}>
      {!hideFilter && (
        <div className="flex justify-end border-b border-border p-3 bg-slate-900/40">
          <label className="flex items-center gap-2 text-sm text-secondary">
            <span>{tCopy('COPY.TABLE_FILTER_ROWS')}</span>
            <div className="relative">
              <Search size={14} className="text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={filterText}
                onChange={(event) => {
                  setFilterText(event.currentTarget.value);
                  setPage(0);
                  onPageChange?.(0);
                }}
                className="min-w-48 rounded-xl border border-border bg-input pl-8 pr-3 py-1.5 text-xs text-primary focus:border-indigo-500 focus:outline-none"
                data-testid="superadmin-support-tickets-support-tickets-semantic-table-field-1"
              />
            </div>
          </label>
        </div>
      )}

      <table className="sa-semantic-table w-full border-collapse text-left text-sm">
        <thead className="bg-slate-900/90 text-slate-300">
          <tr>
            {columns.map((column, index) => {
              const field = column.field ?? `column-${index}`;
              const canSort = column.sortable !== false && Boolean(column.field);
              const isSorted = sort?.field === field;
              const colKey = field.toLowerCase();
              const isActions = /action|actions|operation|operations/.test(colKey);
              const isCenter = /status|priority|severity|age|date|time/.test(colKey) || (typeof column.cellClass === 'string' && column.cellClass.includes('text-center'));
              const isRight = isActions || (typeof column.cellClass === 'string' && column.cellClass.includes('text-right'));
              const headerAlignClass = isRight ? 'justify-end text-right' : isCenter ? 'justify-center text-center' : 'justify-start text-left';

              return (
                <th
                  key={field}
                  scope="col"
                  className={`border-b border-border px-3 py-2.5 font-semibold text-xs uppercase tracking-wider text-slate-300 ${isRight ? 'text-right' : isCenter ? 'text-center' : 'text-left'} ${getColumnWidthClass(column.width, column.minWidth, field)}`}
                >
                  {canSort ? (
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider text-slate-300 hover:text-indigo-300 transition-colors cursor-pointer w-full ${headerAlignClass}`}
                      onClick={() => {
                        setSort((current) =>
                          current?.field === field ? { field, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { field, direction: 'asc' }
                        );
                        setPage(0);
                        onPageChange?.(0);
                      }}
                      aria-label={tCopy('COPY.TABLE_SORT_BY', { column: column.headerName ?? field })}
                      data-testid={`superadmin-support-tickets-support-tickets-semantic-table-table-sort-by-2-${String(field)}`}
                    >
                      <span>{column.headerName ?? field}</span>
                      {isSorted ? (
                        sort.direction === 'asc' ? <ArrowUp size={13} className="text-indigo-400" /> : <ArrowDown size={13} className="text-indigo-400" />
                      ) : (
                        <ArrowUpDown size={12} className="text-slate-500 hover:text-indigo-400" />
                      )}
                    </button>
                  ) : (
                    <div className={`w-full inline-flex items-center ${headerAlignClass}`}>
                      <span>{column.headerName ?? field}</span>
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visibleRows.length === 0 ? (
            <tr>
              <td colSpan={Math.max(1, columns.length)} className="px-4 py-8 text-center text-secondary">
                {(sourceRowCount ?? rowData?.length ?? 0) === 0 ? (
                  <SuperadminSupportTicketsOverviewEmptyState />
                ) : (
                  <SuperadminSupportTicketsOverviewEmptyState filtered />
                )}
              </td>
            </tr>
          ) : (
            visibleRows.map((row) => (
              <tr
                key={getRowId ? getRowId({ data: row }) : stableRowKey(row)}
                data-testid={`superadmin-support-tickets-row-${encodeURIComponent(String(getRowId ? getRowId({ data: row }) : stableRowKey(row)))}`}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(event) => {
                  if (onRowClick && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    onRowClick(row);
                  }
                }}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
                className={`border-b border-border/40 last:border-b-0 hover:bg-indigo-500/10 transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${Object.entries(rowClassRules ?? {})
                  .filter(([, matches]) => matches({ data: row }))
                  .map(([className]) => className)
                  .join(' ')}`}
              >
                {columns.map((column, index) => {
                  const field = column.field ?? `column-${index}`;
                  const colKey = field.toLowerCase();
                  const isActions = /action|actions|operation|operations/.test(colKey);
                  const isCenter = /status|priority|severity|age|date|time/.test(colKey) || (typeof column.cellClass === 'string' && column.cellClass.includes('text-center'));
                  const isRight = isActions || (typeof column.cellClass === 'string' && column.cellClass.includes('text-right'));
                  const alignTdClass = isRight ? 'text-right' : isCenter ? 'text-center' : 'text-left';

                  const raw = column.valueGetter
                    ? column.valueGetter({ data: row, value: undefined, colDef: { field } })
                    : (row as unknown as Record<string, unknown>)[field];
                  const value = typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean' ? raw : raw == null ? undefined : String(raw);
                  const content = column.cellRenderer
                    ? (column.cellRenderer as unknown as (params: SemanticCellParams<T>) => ReactNode)({ data: row, value, colDef: { field } })
                    : column.valueFormatter
                    ? column.valueFormatter({ data: row, value, colDef: { field } })
                    : value;
                  const cellClass = typeof column.cellClass === 'function' ? column.cellClass() : column.cellClass;
                  return (
                    <td key={field} data-label={column.headerName ?? field} className={`px-3 py-2.5 align-middle text-slate-200 ${alignTdClass} ${cellClass ?? ''}`}>
                      {displayValue(content as ReactNode)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border/80 bg-slate-900/40 text-xs sm:text-sm text-secondary">
          <span>
            {sortedRows.length === 0
              ? tCopy('COPY.TABLE_ROWS_ZERO')
              : tCopy('COPY.TABLE_ROWS_RANGE', {
                  start: activePage * paginationPageSize + 1,
                  end: Math.min((activePage + 1) * paginationPageSize, sortedRows.length),
                  total: sortedRows.length,
                })}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all cursor-pointer active:scale-[0.97]"
              disabled={activePage === 0}
              onClick={() => {
                const nextPage = Math.max(0, activePage - 1);
                setPage(nextPage);
                onPageChange?.(nextPage);
              }}
              data-testid="superadmin-support-tickets-support-tickets-semantic-table-table-previous-3"
            >
              <ChevronLeft size={14} />
              <span>{tCopy('COPY.TABLE_PREVIOUS')}</span>
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pageCount) }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPage(idx);
                    onPageChange?.(idx);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-[0.97] ${
                    activePage === idx ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all cursor-pointer active:scale-[0.97]"
              disabled={activePage + 1 >= pageCount}
              onClick={() => {
                const nextPage = Math.min(pageCount - 1, activePage + 1);
                setPage(nextPage);
                onPageChange?.(nextPage);
              }}
              data-testid="superadmin-support-tickets-support-tickets-semantic-table-table-next-4"
            >
              <span>{tCopy('COPY.TABLE_NEXT')}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
