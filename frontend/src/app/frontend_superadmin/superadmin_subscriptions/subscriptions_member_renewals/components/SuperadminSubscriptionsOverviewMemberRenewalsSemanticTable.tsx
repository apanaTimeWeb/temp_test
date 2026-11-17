'use client';
import SuperadminSubscriptionsOverviewMemberRenewalsEmptyState from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/components/SuperadminSubscriptionsOverviewMemberRenewalsEmptyState';
/** Responsibility: Superadmin Finance Semantic Table; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { useTranslations } from 'next-intl';
import { type ReactNode } from 'react';
import { Search, X, ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

import type { SemanticCellParams, SemanticColumnDef, SemanticTableProps } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/types/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTableTypes';
import { stableRowKey } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/utils/SuperadminSubscriptionsOverviewMemberRenewalsStableRowKey';
import { useSuperadminSubscriptionsOverviewMemberRenewalsSemanticTableState } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/hooks/useSuperadminSubscriptionsOverviewMemberRenewalsSemanticTableState';
import { displayValue } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/utils/SuperadminSubscriptionsOverviewMemberRenewalsDisplayValue';
export type { SemanticCellParams, SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/types/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTableTypes';


function getColumnWidthClass(width?: number, minWidth?: number, field?: string): string {
  const key = (field ?? '').toLowerCase();
  if (/action|actions|operation|operations/.test(key)) return 'w-24';
  if (/status|role|priority|severity/.test(key)) return 'w-32';
  if (/date|time|created|updated|joined|lastactive|lastlogin/.test(key)) return 'w-36';
  if (/amount|price|revenue|mrr|balance|total|payment|students|count|due/.test(key)) return 'w-36 text-right';
  if (/^id$|_id$|id$|reference|ref$|txn/.test(key)) return 'w-28';
  if (/name|subject|title|description|message|student/.test(key)) return 'min-w-44';
  if (width !== undefined) return width <= 100 ? 'w-24' : width <= 140 ? 'w-28' : width <= 180 ? 'w-32' : 'w-48';
  if (minWidth !== undefined) return minWidth <= 100 ? 'min-w-24' : minWidth <= 140 ? 'min-w-32' : minWidth <= 180 ? 'min-w-40' : 'min-w-48';
  return 'min-w-32';
}

/**
 * Performs the superadmin subscriptions overview member renewals semantic table operation within subscriptions overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SemanticTableProps<T>.
 */
export default function SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable<T extends object>({ rowData, columnDefs, pagination = false, paginationPageSize = 10, className = '', getRowId, rowClassRules }: SemanticTableProps<T>) {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  
  const { sort, setSort, page, setPage, filterText, setFilterText, sortedRows, pageCount, visibleRows } = useSuperadminSubscriptionsOverviewMemberRenewalsSemanticTableState({ rowData, paginationPageSize , paginationEnabled: pagination});
  const columns = (columnDefs ?? []).filter((column) => !column.hide);
  return (
    <div className={`overflow-x-auto ${className}`} role="region" aria-label={tCopy('COPY.TABLE_ARIA_LABEL')} tabIndex={0}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 p-3 bg-slate-900/40">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {tCopy('COPY.RENEWALS_DUE')}
        </span>
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-indigo-400 pointer-events-none" />
          <input
            type="search"
            value={filterText}
            onChange={(event) => { setFilterText(event.currentTarget.value); setPage(0); }}
            placeholder={tCopy('COPY.TABLE_FILTER_ROWS')}
            className="h-9 min-w-48 rounded-xl border border-indigo-500/25 bg-slate-900/60 pl-9 pr-8 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            data-testid="superadmin-finance-finance-semantic-table-field-1"
          />
          {filterText && (
            <button
              type="button"
              onClick={() => { setFilterText(''); setPage(0); }}
              className="absolute right-2.5 text-slate-400 hover:text-slate-200"
              aria-label="Clear filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <table className="sa-semantic-table w-full border-collapse text-left text-sm">
        <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <tr>
            {columns.map((column, index) => {
              const field = column.field ?? `column-${index}`;
              const canSort = column.sortable !== false && Boolean(column.field);
              const isSorted = sort?.field === field;
              return (
                <th key={field} scope="col" className={`border-b border-indigo-500/20 px-4 py-3 font-semibold ${getColumnWidthClass(column.width, column.minWidth, field)}`}>
                  {canSort ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-left font-semibold text-slate-300 hover:text-indigo-300 transition-colors"
                      onClick={() => {
                        setSort((current) => current?.field === field ? { field, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { field, direction: 'asc' });
                        setPage(0);
                      }}
                      aria-label={tCopy('COPY.TABLE_SORT_BY', { column: column.headerName ?? field })}
                      data-testid={`superadmin-finance-finance-semantic-table-table-sort-by-2-${String(field)}`}
                    >
                      <span>{column.headerName ?? field}</span>
                      {isSorted ? (
                        sort.direction === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5 text-indigo-400" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5 text-indigo-400" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 text-slate-500 opacity-60" />
                      )}
                    </button>
                  ) : (
                    <span>{column.headerName ?? field}</span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-indigo-500/10">
          {visibleRows.length === 0 ? (
            <tr>
              <td colSpan={Math.max(1, columns.length)} className="px-4 py-12 text-center text-slate-400" role="status">
                <SuperadminSubscriptionsOverviewMemberRenewalsEmptyState filtered />
              </td>
            </tr>
          ) : (
            visibleRows.map((row) => (
              <tr
                key={getRowId ? getRowId({ data: row }) : stableRowKey(row)}
                className={`transition-colors hover:bg-indigo-500/[0.04] ${Object.entries(rowClassRules ?? {}).filter(([, matches]) => matches({ data: row })).map(([className]) => className).join(' ')}`}
              >
                {columns.map((column, index) => {
                  const field = column.field ?? `column-${index}`;
                  const raw = column.valueGetter ? column.valueGetter({ data: row, value: undefined, colDef: { field } }) : (row as unknown as Record<string, unknown>)[field];
                  const value = typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean' ? raw : raw == null ? undefined : String(raw);
                  const content = column.cellRenderer ? (column.cellRenderer as unknown as (params: SemanticCellParams<T>) => ReactNode)({ data: row, value, colDef: { field } }) : column.valueFormatter ? column.valueFormatter({ data: row, value, colDef: { field } }) : value;
                  const cellClass = typeof column.cellClass === 'function' ? column.cellClass() : column.cellClass;
                  return (
                    <td key={field} data-label={column.headerName ?? field} className={`px-4 py-3 align-middle text-slate-200 ${cellClass ?? ''}`}>
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-indigo-500/20 px-4 py-3 text-xs text-slate-400 bg-slate-900/40">
          <span>
            {sortedRows.length === 0
              ? tCopy('COPY.TABLE_ROWS_ZERO')
              : tCopy('COPY.TABLE_ROWS_RANGE', {
                  start: page * paginationPageSize + 1,
                  end: Math.min((page + 1) * paginationPageSize, sortedRows.length),
                  total: sortedRows.length,
                })}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-40 transition-all cursor-pointer"
              disabled={page === 0}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              data-testid="superadmin-finance-finance-semantic-table-table-previous-3"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>{tCopy('COPY.TABLE_PREVIOUS')}</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-40 transition-all cursor-pointer"
              disabled={page + 1 >= pageCount}
              onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
              data-testid="superadmin-finance-finance-semantic-table-table-next-4"
            >
              <span>{tCopy('COPY.TABLE_NEXT')}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
