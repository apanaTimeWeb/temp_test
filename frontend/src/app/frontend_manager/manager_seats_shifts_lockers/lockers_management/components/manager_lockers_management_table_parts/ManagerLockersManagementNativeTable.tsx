'use client';
// RESPONSIBILITY: Define or render the table structure for the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Define or render the table structure for the components feature. It does not own backend persistence or cross-feature business logic.
import { displayValue } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/utils/ManagerLockersManagementDisplayValue';
import { createElement, type ReactNode } from 'react';
import type { ManagerLockersManagementNativeCellParams, ManagerLockersManagementNativeColumn, ManagerLockersManagementNativeTableProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/types/ManagerLockersManagementComponentTypes';
export type { ManagerLockersManagementNativeCellParams, ManagerLockersManagementNativeColumn, ManagerLockersManagementNativeTableProps };





/** Accessible, keyboard-native data table owned by the seats/shifts/lockers feature. */
export function ManagerLockersManagementNativeTable<T extends object>({ rows, columns, getRowKey, label }: ManagerLockersManagementNativeTableProps<T>) {
  return (
    <div className="ss-table-wrapper overflow-x-auto">
      <table className="ss-table w-full" aria-label={label}>
        <thead><tr>{columns.map((column, index) => <th scope="col" key={`${column.headerName}-${index}`}>{column.headerName}</th>)}</tr></thead>
        <tbody>{rows.map((row, rowIndex) => <tr key={getRowKey(row, rowIndex)}>
          {columns.map((column, columnIndex) => {
            const field = column.field == null ? undefined : String(column.field);
            const value = field ? (row as unknown as Record<string, unknown>)[field] : undefined;
            const params: ManagerLockersManagementNativeCellParams<T> = { value, data: row };
            let content: ReactNode = displayValue(value);
            if (column.cellRenderer) content = createElement(column.cellRenderer, params);
            else if (column.valueFormatter) content = column.valueFormatter(params);
            return <td key={`${column.headerName}-${columnIndex}`}>{content}</td>;
          })}</tr>)}</tbody>
      </table>
    </div>
  );
}
