'use client';
// RESPONSIBILITY: Define or render the table structure for the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Define or render the table structure for the components feature. It does not own backend persistence or cross-feature business logic.
import { displayValue } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/utils/ManagerAccountsExpensesDisplayValue';

import { useMemo, useState } from 'react';
import type { ManagerAccountsExpensesNativeTableProps, NativeCellParams, NativeColumn, ManagerAccountsExpensesSortDirection } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';
export type { NativeCellParams, NativeColumn };






/** Accessible module-owned table replacement for the unsupported AG Grid dependency. */
export default function ManagerAccountsExpensesNativeTable<T extends object>({ rows, columns, getRowKey, labels }: ManagerAccountsExpensesNativeTableProps<T>) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<ManagerAccountsExpensesSortDirection>('asc');
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const sortedRows = useMemo(() => {
    if (!sortField) return rows;
    const getValue = (row: T): unknown => (row as unknown as Record<string, unknown>)[sortField];
    return [...rows].sort((a, b) => {
      const left = getValue(a); const right = getValue(b);
      const comparison = typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [rows, sortField, sortDirection]);
  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const visibleRows = sortedRows.slice(effectivePage * pageSize, effectivePage * pageSize + pageSize);
  const changeSort = (field: string) => {
    if (sortField === field) setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
    setPage(0);
  };
  return <div className="w-full min-w-0">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left" aria-rowcount={rows.length + 1}>
        <thead><tr className="border-b border-border bg-surface text-xs text-secondary">
          {columns.map((column, index) => <th key={column.field ?? column.headerName ?? JSON.stringify(column)} scope="col" aria-sort={sortField === column.field ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="px-3 py-3 font-semibold whitespace-nowrap">
            {column.field && column.sortable !== false ? <button type="button" className="inline-flex items-center gap-1 text-left" onClick={() => changeSort(String(column.field))} aria-label={`Sort by ${column.headerName ?? column.field}`}>
              {column.headerName ?? column.field} {sortField === column.field ? (sortDirection === 'asc' ? '↑' : '↓') : null}
            </button> : (column.headerName ?? column.field ?? '—')}
          </th>)}
        </tr></thead>
        <tbody>{visibleRows.map((row, rowIndex) => <tr key={getRowKey(row)} className="border-b border-border last:border-0 hover:bg-surface-hover">
          {columns.map((column, columnIndex) => {
            const rawValue = column.field ? (row as unknown as Record<string, unknown>)[column.field] : undefined;
            const value: NativeCellParams<T>['value'] = typeof rawValue === 'string' || typeof rawValue === 'number' || typeof rawValue === 'boolean' ? rawValue : rawValue == null ? null : String(rawValue);
            const params: NativeCellParams<T> = { data: row, value };
            const content = column.cellRenderer ? column.cellRenderer(params) : column.valueFormatter ? column.valueFormatter(params) : displayValue(rawValue);
            return <td key={column.field ?? column.headerName ?? JSON.stringify(column)} className={`px-3 py-3 align-middle text-sm ${typeof column.cellClass === 'function' ? column.cellClass(params) : column.cellClass ?? ''}`}>{content}</td>;
          })}
        </tr>)}</tbody>
      </table>
    </div>
    {rows.length > pageSize && <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-3 text-sm text-secondary">
      <span> {Math.min(effectivePage * pageSize + 1, rows.length)}–{Math.min((effectivePage + 1) * pageSize, rows.length)} / {rows.length} </span>
      <div className="flex gap-2"><button type="button" className="mgr-btn-ghost mgr-btn-sm" disabled={page <= 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>{labels?.previous ?? 'Previous page'}</button><button type="button" className="mgr-btn-ghost mgr-btn-sm" disabled={page >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>{labels?.next ?? 'Next page'}</button></div>
    </div>}
  </div>;
}
