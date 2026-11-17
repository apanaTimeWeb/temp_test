'use client';
import SuperadminSecurityUserSessionsEmptyState from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/components/SuperadminSecurityUserSessionsEmptyState';
/** Responsibility: semantic, responsive table owned by security_user_sessions. */
/** Data-Flow: local session records + leaf-owned table state -> accessible desktop table/mobile cards; writes stay disabled without host contracts. */
import { useTranslations } from 'next-intl';
import { type ReactNode } from 'react';
import { Search, X, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import styles from './SuperadminSecurityUserSessionsSemanticTable.module.css';
import type { SemanticCellParams, SemanticColumnDef, SemanticTableProps } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/types/SuperadminSecurityUserSessionsSemanticTableTypes';
import { stableRowKey } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/utils/SuperadminSecurityUserSessionsStableRowKey';
import { useSuperadminSecurityUserSessionsSemanticTableState } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/hooks/useSuperadminSecurityUserSessionsSemanticTableState';
import { displayValue } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/utils/SuperadminSecurityUserSessionsDisplayValue';
export type { SemanticCellParams, SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/types/SuperadminSecurityUserSessionsSemanticTableTypes';

function getColumnWidthClass(width?: number, minWidth?: number, field?: string): string {
  const key = (field ?? '').toLowerCase();
  if (/action|actions|operation|operations/.test(key)) return 'w-24';
  if (/status|role|priority|severity/.test(key)) return 'w-28';
  if (/date|time|created|updated|joined|lastactive|lastlogin/.test(key)) return 'w-32';
  if (/amount|price|revenue|mrr|balance|total|payment|students|count/.test(key)) return 'w-32 text-right';
  if (/^id$|_id$|id$|reference|ref$|txn/.test(key)) return 'w-24';
  if (/name|subject|title|description|message/.test(key)) return 'min-w-40';
  if (width !== undefined) return width <= 100 ? 'w-24' : width <= 140 ? 'w-28' : width <= 180 ? 'w-32' : 'w-48';
  if (minWidth !== undefined) return minWidth <= 100 ? 'min-w-24' : minWidth <= 140 ? 'min-w-32' : minWidth <= 180 ? 'min-w-40' : 'min-w-48';
  return 'min-w-32';
}

/** Applies the declared fixed/flexible column sizing contract rather than silently ignoring it. */
export default function SuperadminSecurityUserSessionsSemanticTable<T extends object>({
  rowData,
  columnDefs,
  rowHeight,
  headerHeight,
  pagination = false,
  paginationPageSize = 10,
  className = '',
  getRowId,
  rowClassRules,
}: SemanticTableProps<T>) {
  const tCopy = useTranslations('SUPERADMIN_USERS');
  const { sort, setSort, page, setPage, filterText, setFilterText, sortedRows, pageCount, visibleRows } = useSuperadminSecurityUserSessionsSemanticTableState({ rowData, paginationPageSize, paginationEnabled: pagination });
  const columns = (columnDefs ?? []).filter((column) => !column.hide);
  const totalFlexibleUnits = columns.reduce((total, column) => total + (column.width === undefined ? Math.max(0, column.flex ?? 1) : 0), 0) || 1;

  return (
    <div className={`${styles.responsiveRegion} overflow-x-auto ${className}`} role="region" aria-label={tCopy('COPY.TABLE_ARIA_LABEL')} tabIndex={0}>
      {/* Search & Filter Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 p-3 sm:p-4 bg-slate-900/30">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {tCopy('COPY.TABLE_FILTER_ROWS')}
        </span>
        <div className="relative flex items-center w-full sm:w-64">
          <Search size={15} className="absolute left-3 text-indigo-400 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={filterText}
            onChange={(event) => { setFilterText(event.currentTarget.value); setPage(0); }}
            className="w-full rounded-xl border border-indigo-500/25 bg-card/80 pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
            data-testid="superadmin-users-users-semantic-table-field-1"
            placeholder="Search records..."
          />
          {filterText && (
            <button
              type="button"
              onClick={() => { setFilterText(''); setPage(0); }}
              className="absolute right-2.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Clear filter"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <table className="sa-semantic-table w-full border-collapse text-left text-sm">
        <colgroup>
          {columns.map((column, index) => {
            const field = column.field ?? `column-${index}`;
            const width = column.width !== undefined ? `${column.width}px` : `${(Math.max(0, column.flex ?? 1) / totalFlexibleUnits) * 100}%`;
            return <col key={field} style={{ width, minWidth: column.minWidth !== undefined ? `${column.minWidth}px` : undefined }} />;
          })}
        </colgroup>
        <thead className="bg-slate-900/50 text-slate-300">
          <tr>
            {columns.map((column, index) => {
              const field = column.field ?? `column-${index}`;
              const canSort = column.sortable !== false && Boolean(column.field);
              const activeSortDirection = sort?.field === field ? sort.direction : undefined;
              const ariaSort = activeSortDirection === 'asc' ? 'ascending' : activeSortDirection === 'desc' ? 'descending' : undefined;
              const sortDirectionLabel = activeSortDirection === 'asc' ? tCopy('COPY.TABLE_SORT_DIRECTION_ASCENDING') : activeSortDirection === 'desc' ? tCopy('COPY.TABLE_SORT_DIRECTION_DESCENDING') : undefined;
              return (
                <th
                  key={field}
                  scope="col"
                  aria-sort={ariaSort}
                  style={{
                    height: headerHeight !== undefined ? `${headerHeight}px` : undefined,
                    width: column.width !== undefined ? `${column.width}px` : undefined,
                    minWidth: column.minWidth !== undefined ? `${column.minWidth}px` : undefined,
                  }}
                  className={`border-b border-border/80 px-4 py-3 font-semibold text-xs sm:text-sm text-slate-300 ${getColumnWidthClass(column.width, column.minWidth, field)}`}
                >
                  {canSort ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-left text-slate-200 hover:text-indigo-300 transition-colors cursor-pointer"
                      onClick={() => {
                        setSort((current) => current?.field === field ? { field, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { field, direction: 'asc' });
                        setPage(0);
                      }}
                      aria-label={activeSortDirection ? tCopy('COPY.TABLE_SORT_BY_DIRECTION', { column: column.headerName ?? field, direction: sortDirectionLabel ?? '' }) : tCopy('COPY.TABLE_SORT_BY', { column: column.headerName ?? field })}
                      data-testid={`superadmin-users-users-semantic-table-table-sort-by-2-${String(field)}`}
                    >
                      <span>{column.headerName ?? field}</span>
                      {activeSortDirection === 'asc' && <ArrowUp size={13} className="text-indigo-400 font-bold" />}
                      {activeSortDirection === 'desc' && <ArrowDown size={13} className="text-indigo-400 font-bold" />}
                      {!activeSortDirection && <ArrowUpDown size={12} className="text-slate-500 opacity-50" />}
                    </button>
                  ) : (
                    column.headerName ?? field
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {visibleRows.length === 0 ? (
            <tr>
              <td colSpan={Math.max(1, columns.length)} className="px-4 py-12 text-center text-slate-400" role="status">
                <SuperadminSecurityUserSessionsEmptyState filtered={(rowData?.length ?? 0) !== 0} />
              </td>
            </tr>
          ) : (
            visibleRows.map((row) => (
              <tr
                key={getRowId ? getRowId({ data: row }) : stableRowKey(row)}
                style={{ height: rowHeight !== undefined ? `${rowHeight}px` : undefined }}
                className={`transition-colors hover:bg-slate-800/30 ${Object.entries(rowClassRules ?? {}).filter(([, matches]) => matches({ data: row })).map(([cName]) => cName).join(' ')}`}
              >
                {columns.map((column, index) => {
                  const field = column.field ?? `column-${index}`;
                  const raw = column.valueGetter ? column.valueGetter({ data: row, value: undefined, colDef: { field } }) : (row as unknown as Record<string, unknown>)[field];
                  const value = typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean' ? raw : raw == null ? undefined : String(raw);
                  const content = column.cellRenderer ? (column.cellRenderer as unknown as (params: SemanticCellParams<T>) => ReactNode)({ data: row, value, colDef: { field } }) : column.valueFormatter ? column.valueFormatter({ data: row, value, colDef: { field } }) : value;
                  const cellClass = typeof column.cellClass === 'function' ? column.cellClass() : column.cellClass;
                  return (
                    <td
                      key={field}
                      style={{ width: column.width !== undefined ? `${column.width}px` : undefined, minWidth: column.minWidth !== undefined ? `${column.minWidth}px` : undefined }}
                      data-label={column.headerName ?? field}
                      data-primary-cell={index === 0 ? 'true' : undefined}
                      data-status-cell={/status/i.test(field) ? 'true' : undefined}
                      className={`px-4 py-3 align-middle ${cellClass ?? ''}`}
                    >
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/80 px-4 py-3 text-xs sm:text-sm text-slate-400 bg-slate-900/20">
          <span>
            {sortedRows.length === 0
              ? tCopy('COPY.TABLE_ROWS_ZERO')
              : tCopy('COPY.TABLE_ROWS_RANGE', { start: page * paginationPageSize + 1, end: Math.min((page + 1) * paginationPageSize, sortedRows.length), total: sortedRows.length })}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-all hover:bg-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              disabled={page === 0}
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              data-testid="superadmin-users-users-semantic-table-table-previous-3"
            >
              <ChevronLeft size={13} className="text-indigo-400" />
              <span>{tCopy('COPY.TABLE_PREVIOUS')}</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-all hover:bg-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              disabled={page + 1 >= pageCount}
              onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
              data-testid="superadmin-users-users-semantic-table-table-next-4"
            >
              <span>{tCopy('COPY.TABLE_NEXT')}</span>
              <ChevronRight size={13} className="text-indigo-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
