'use client';
import SuperadminBillingInvoicesEmptyState from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesEmptyState';
/** Responsibility: Superadmin Billing Semantic Table; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminBillingInvoicesSemanticTable formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { useTranslations } from 'next-intl';
import { type ReactNode } from 'react';

import type { SemanticCellParams, SemanticColumnDef, SemanticTableProps } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesSemanticTableTypes';
import { stableRowKey } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesStableRowKey';
import { useSuperadminBillingInvoicesSemanticTableState } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/hooks/useSuperadminBillingInvoicesSemanticTableState';
import { displayValue } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesDisplayValue';
export type { SemanticCellParams, SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesSemanticTableTypes';


function getColumnWidthClass(width?: number, minWidth?: number, field?: string): string {
  const key = (field ?? '').toLowerCase();
  if (/action|actions|operation|operations/.test(key)) return 'w-20';
  if (/status|role|priority|severity/.test(key)) return 'w-28';
  if (/date|time|created|updated|joined|lastactive|lastlogin/.test(key)) return 'w-32';
  if (/amount|price|revenue|mrr|balance|total|payment|students|count/.test(key)) return 'w-32 text-right';
  if (/^id$|_id$|id$|reference|ref$|txn/.test(key)) return 'w-24';
  if (/name|subject|title|description|message/.test(key)) return 'min-w-40';
  if (width !== undefined) return width <= 100 ? 'w-24' : width <= 140 ? 'w-28' : width <= 180 ? 'w-32' : 'w-48';
  if (minWidth !== undefined) return minWidth <= 100 ? 'min-w-24' : minWidth <= 140 ? 'min-w-32' : minWidth <= 180 ? 'min-w-40' : 'min-w-48';
  return 'min-w-32';
}

/**
 * Performs the superadmin billing invoices semantic table operation within billing invoices; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SemanticTableProps<T>.
 */
export default function SuperadminBillingInvoicesSemanticTable<T extends object>({ rowData, columnDefs, pagination = false, paginationPageSize = 10, className = '', getRowId, rowClassRules }: SemanticTableProps<T>) {
  const tCopy = useTranslations('SUPERADMIN_BILLING');
  
  const { sort, setSort, page, setPage, filterText, setFilterText, sortedRows, pageCount, visibleRows } = useSuperadminBillingInvoicesSemanticTableState({ rowData, paginationPageSize , paginationEnabled: pagination});
  const columns = (columnDefs ?? []).filter((column) => !column.hide);
  return (
    <div
      className={`overflow-x-auto rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#0c0f2b] via-[#090b20] to-[#060818] shadow-2xl ${className}`}
      role="region"
      aria-label={tCopy('COPY.TABLE_ARIA_LABEL')}
      tabIndex={0}
    >
      <div className="flex justify-end border-b border-indigo-500/20 bg-indigo-950/25 p-3">
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <span>{tCopy('COPY.TABLE_FILTER_ROWS')}</span>
          <input maxLength={100}
            type="search"
            value={filterText}
            onChange={(event) => {
              setFilterText(event.currentTarget.value);
              setPage(0);
            }}
            className="min-w-40 rounded-xl border border-indigo-500/30 bg-[#07091a]/80 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            data-testid="superadmin-billing-billing-semantic-table-field-1"
          />
        </label>
      </div>
      <table className="sa-semantic-table w-full border-collapse text-left text-xs sm:text-sm">
        <thead className="border-b border-indigo-500/20 bg-[#07091a]/95 text-slate-300 uppercase tracking-wider text-[11px] font-semibold">
          <tr>
            {columns.map((column, index) => {
              const field = column.field ?? `column-${index}`;
              const canSort = column.sortable !== false && Boolean(column.field);
              return (
                <th
                  key={field}
                  scope="col"
                  className={`border-b border-indigo-500/20 px-4 py-3 font-semibold ${getColumnWidthClass(
                    column.width,
                    column.minWidth,
                    field
                  )}`}
                >
                  {canSort ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
                      onClick={() => {
                        setSort((current) =>
                          current?.field === field
                            ? { field, direction: current.direction === 'asc' ? 'desc' : 'asc' }
                            : { field, direction: 'asc' }
                        );
                        setPage(0);
                      }}
                      aria-label={tCopy('COPY.TABLE_SORT_BY', { column: column.headerName ?? field })}
                      data-testid={`superadmin-billing-billing-semantic-table-table-sort-by-2-${String(field)}`}
                    >
                      {column.headerName ?? field}
                      {sort?.field === field ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ''}
                    </button>
                  ) : (
                    column.headerName ?? field
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-indigo-500/10">
          {visibleRows.length === 0 ? (
            <tr>
              <td
                colSpan={Math.max(1, columns.length)}
                className="px-4 py-10 text-center text-slate-400 text-xs"
                role="status"
              >
                {(rowData?.length ?? 0) === 0 ? (
                  <SuperadminBillingInvoicesEmptyState />
                ) : (
                  <SuperadminBillingInvoicesEmptyState filtered />
                )}
              </td>
            </tr>
          ) : (
            visibleRows.map((row) => (
              <tr
                key={getRowId ? getRowId({ data: row }) : stableRowKey(row)}
                className={`border-b border-indigo-500/10 hover:bg-indigo-950/30 transition-colors ${
                  Object.entries(rowClassRules ?? {})
                    .filter(([, matches]) => matches({ data: row }))
                    .map(([className]) => className)
                    .join(' ')
                }`}
              >
                {columns.map((column, index) => {
                  const field = column.field ?? `column-${index}`;
                  const raw = column.valueGetter
                    ? column.valueGetter({ data: row, value: undefined, colDef: { field } })
                    : (row as unknown as Record<string, unknown>)[field];
                  const value =
                    typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean'
                      ? raw
                      : raw == null
                      ? undefined
                      : String(raw);
                  const content = column.cellRenderer
                    ? (column.cellRenderer as unknown as (params: SemanticCellParams<T>) => ReactNode)({
                        data: row,
                        value,
                        colDef: { field },
                      })
                    : column.valueFormatter
                    ? column.valueFormatter({ data: row, value, colDef: { field } })
                    : value;
                  const cellClass = typeof column.cellClass === 'function' ? column.cellClass() : column.cellClass;
                  return (
                    <td
                      key={field}
                      data-label={column.headerName ?? field}
                      className={`px-4 py-3 align-middle text-slate-200 ${cellClass ?? ''}`}
                    >
                      {typeof content === 'boolean'
                        ? tCopy(content ? 'COPY.BOOLEAN_TRUE' : 'COPY.BOOLEAN_FALSE')
                        : displayValue(content as ReactNode)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && (
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-indigo-500/20 bg-[#07091a]/80 text-xs text-slate-400">
          <span>
            {sortedRows.length === 0
              ? tCopy('COPY.TABLE_ROWS_ZERO')
              : tCopy('COPY.TABLE_ROWS_RANGE', {
                  start: page * paginationPageSize + 1,
                  end: Math.min((page + 1) * paginationPageSize, sortedRows.length),
                  total: sortedRows.length,
                })}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/50 hover:bg-indigo-900/60 text-slate-200 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer transition-all shadow-xs active:scale-[0.98]"
              disabled={page === 0}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              data-testid="superadmin-billing-billing-semantic-table-table-previous-3"
            >
              {tCopy('COPY.TABLE_PREVIOUS')}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/50 hover:bg-indigo-900/60 text-slate-200 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold cursor-pointer transition-all shadow-xs active:scale-[0.98]"
              disabled={page + 1 >= pageCount}
              onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
              data-testid="superadmin-billing-billing-semantic-table-table-next-4"
            >
              {tCopy('COPY.TABLE_NEXT')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
