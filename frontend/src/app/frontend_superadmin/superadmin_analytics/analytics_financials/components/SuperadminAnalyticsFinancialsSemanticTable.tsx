'use client';
import SuperadminAnalyticsFinancialsEmptyState from '@/app/frontend_superadmin/superadmin_analytics/analytics_financials/components/SuperadminAnalyticsFinancialsEmptyState';
/** Responsibility: Superadmin Reports Semantic Table; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminAnalyticsFinancialsSemanticTable formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { useTranslations } from 'next-intl';
import { type ReactNode } from 'react';

import type { SemanticCellParams, SemanticColumnDef, SemanticTableProps } from '@/app/frontend_superadmin/superadmin_analytics/analytics_financials/types/SuperadminAnalyticsFinancialsSemanticTableTypes';
import { stableRowKey } from '@/app/frontend_superadmin/superadmin_analytics/analytics_financials/utils/SuperadminAnalyticsFinancialsStableRowKey';
import { useSuperadminAnalyticsFinancialsSemanticTableState } from '@/app/frontend_superadmin/superadmin_analytics/analytics_financials/hooks/useSuperadminAnalyticsFinancialsSemanticTableState';
import { displayValue } from '@/app/frontend_superadmin/superadmin_analytics/analytics_financials/utils/SuperadminAnalyticsFinancialsDisplayValue';
export type { SemanticCellParams, SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_analytics/analytics_financials/types/SuperadminAnalyticsFinancialsSemanticTableTypes';


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
 * Performs the superadmin analytics financials semantic table operation within analytics financials; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SemanticTableProps<T>.
 */
export default function SuperadminAnalyticsFinancialsSemanticTable<T extends object>({ rowData, columnDefs, pagination = false, paginationPageSize = 10, className = '', getRowId, rowClassRules, onRowClick, hideFilter = false, pageIndex, onPageChange }: SemanticTableProps<T>) {
  const tCopy = useTranslations('SUPERADMIN_REPORTS');
  const { sort, setSort, setPage, filterText, setFilterText, sortedRows, pageCount, activePage, visibleRows } = useSuperadminAnalyticsFinancialsSemanticTableState({ rowData, paginationPageSize, pageIndex, onPageChange, paginationEnabled: pagination });
  const columns = (columnDefs ?? []).filter((column) => !column.hide);
  return <div className={`overflow-x-auto ${className}`} role="region" aria-label={tCopy('COPY.TABLE_ARIA_LABEL')} tabIndex={0}>
    {!hideFilter && <div className="flex justify-end border-b border-border p-3"><label className="flex items-center gap-2 text-sm text-secondary"><span>{tCopy('COPY.TABLE_FILTER_ROWS')}</span><input type="search" value={filterText} onChange={(event) => { setFilterText(event.currentTarget.value); setPage(0); onPageChange?.(0); }} className="min-w-40 rounded-md border border-border bg-input px-3 py-2 text-primary"  data-testid="superadmin-reports-reports-semantic-table-field-1"/></label></div>}
    <table className="sa-semantic-table w-full border-collapse text-left text-sm">
      <thead className="bg-card text-secondary"><tr>{columns.map((column, index) => {
        const field = column.field ?? `column-${index}`;
        const canSort = column.sortable !== false && Boolean(column.field);
        return <th key={field} scope="col" className={`border-b border-border px-4 py-3 font-semibold ${getColumnWidthClass(column.width, column.minWidth, field)}`}>
          {canSort ? <button type="button" className="inline-flex items-center gap-1 text-left" onClick={() => { setSort((current) => current?.field === field ? { field, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { field, direction: 'asc' }); setPage(0); onPageChange?.(0); }} aria-label={tCopy('COPY.TABLE_SORT_BY', { column: column.headerName ?? field })} data-testid={`superadmin-reports-reports-semantic-table-table-sort-by-2-${String(field)}`}>
            {column.headerName ?? field}{sort?.field === field ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : ''}
          </button> : (column.headerName ?? field)}
        </th>;
      })}</tr></thead>
      <tbody>{visibleRows.length === 0 ? <tr><td colSpan={Math.max(1, columns.length)} className="px-4 py-8 text-center text-secondary" role="status">{<SuperadminAnalyticsFinancialsEmptyState filtered={(rowData?.length ?? 0) !== 0 && Boolean(filterText.trim())} />}</td></tr> : visibleRows.map((row) => <tr key={getRowId ? getRowId({ data: row }) : stableRowKey(row)} onClick={() => onRowClick?.(row)} onKeyDown={(event) => { if (onRowClick && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onRowClick(row); } }} tabIndex={onRowClick ? 0 : undefined} className={`border-b border-border last:border-b-0 hover:bg-surface-hover ${Object.entries(rowClassRules ?? {}).filter(([, matches]) => matches({ data: row })).map(([className]) => className).join(' ')}`} data-testid="superadmin-superadmin-reports-overview-semantic-table-tr-line-43">{columns.map((column, index) => {
        const field = column.field ?? `column-${index}`;
        const raw = column.valueGetter ? column.valueGetter({ data: row, value: undefined, colDef: { field } }) : (row as unknown as Record<string, unknown>)[field];
        const value = typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean' ? raw : raw == null ? undefined : String(raw);
        const content = column.cellRenderer ? (column.cellRenderer as unknown as (params: SemanticCellParams<T>) => ReactNode)({ data: row, value, colDef: { field } }) : column.valueFormatter ? column.valueFormatter({ data: row, value, colDef: { field } }) : value;
        const cellClass = typeof column.cellClass === 'function' ? column.cellClass() : column.cellClass;
        return <td key={field} data-label={column.headerName ?? field} className={`px-4 py-3 align-middle ${cellClass ?? ''}`}>{typeof content === 'boolean' ? tCopy(content ? 'COPY.BOOLEAN_YES' : 'COPY.BOOLEAN_NO') : displayValue(content as ReactNode)}</td>;
      })}</tr>)}</tbody>
    </table>
    {pagination && <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-secondary"><span>{sortedRows.length === 0 ? tCopy('COPY.TABLE_ROWS_ZERO') : tCopy('COPY.TABLE_ROWS_RANGE', { start: activePage * paginationPageSize + 1, end: Math.min((activePage + 1) * paginationPageSize, sortedRows.length), total: sortedRows.length })}</span><div className="flex gap-2"><button type="button" className="rounded border border-border px-3 py-1 disabled:opacity-50" disabled={activePage === 0} onClick={() => { const nextPage = Math.max(0, activePage - 1); setPage(nextPage); onPageChange?.(nextPage); }} data-testid="superadmin-reports-reports-semantic-table-table-previous-3">{tCopy('COPY.TABLE_PREVIOUS')}</button><button type="button" className="rounded border border-border px-3 py-1 disabled:opacity-50" disabled={activePage + 1 >= pageCount} onClick={() => { const nextPage = Math.min(pageCount - 1, activePage + 1); setPage(nextPage); onPageChange?.(nextPage); }} data-testid="superadmin-reports-reports-semantic-table-table-next-4">{tCopy('COPY.TABLE_NEXT')}</button></div></div>}
  </div>;
}
