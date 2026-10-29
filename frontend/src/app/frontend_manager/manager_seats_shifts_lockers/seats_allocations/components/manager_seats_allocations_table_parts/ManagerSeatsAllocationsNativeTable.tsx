'use client';
// RESPONSIBILITY: Define or render the table structure for the components feature. It does not own backend persistence or cross-feature business logic.
import { displayValue } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/utils/ManagerSeatsAllocationsDisplayValue';
import { createElement, useState, type ReactNode } from 'react';
import type { ManagerSeatsAllocationsNativeCellParams, ManagerSeatsAllocationsNativeColumn, ManagerSeatsAllocationsNativeTableProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/types/ManagerSeatsAllocationsComponentTypes';
export type { ManagerSeatsAllocationsNativeCellParams, ManagerSeatsAllocationsNativeColumn, ManagerSeatsAllocationsNativeTableProps };

/** Accessible, keyboard-native data table owned by the seats/shifts/lockers feature. */
export function ManagerSeatsAllocationsNativeTable<T extends object>({ rows, columns, getRowKey, label }: ManagerSeatsAllocationsNativeTableProps<T>) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const totalRows = rows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const visibleRows = rows.slice(effectivePage * pageSize, effectivePage * pageSize + pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  return (
    <div className="ss-table-wrapper overflow-x-auto">
      <table className="ss-table w-full" aria-label={label}>
        <thead>
          <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold">
            {columns.map((column, index) => (
              <th scope="col" key={`${column.headerName}-${index}`} className="px-3 py-3 font-semibold whitespace-nowrap">
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, rowIndex) => (
            <tr key={getRowKey(row, effectivePage * pageSize + rowIndex)} className="border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12">
              {columns.map((column, columnIndex) => {
                const field = column.field == null ? undefined : String(column.field);
                const value = field ? (row as unknown as Record<string, unknown>)[field] : undefined;
                const params: ManagerSeatsAllocationsNativeCellParams<T> = { value, data: row };
                let content: ReactNode = displayValue(value);
                if (column.cellRenderer) content = createElement(column.cellRenderer, params);
                else if (column.valueFormatter) content = column.valueFormatter(params);
                return <td key={`${column.headerName}-${columnIndex}`} className="px-3 py-3 align-middle text-sm">{content}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-3 py-3 text-sm text-secondary">
        <span>
          Showing {startItem}–{endItem} of {totalRows} results
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <label htmlFor="rows-per-page-seats-allocations" className="text-xs text-secondary whitespace-nowrap">
              Rows per page:
            </label>
            <select
              id="rows-per-page-seats-allocations"
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
    </div>
  );
}
