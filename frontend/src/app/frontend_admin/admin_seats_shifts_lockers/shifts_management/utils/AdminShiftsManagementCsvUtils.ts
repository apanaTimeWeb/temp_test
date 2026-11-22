import type { AdminShiftsShift } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/types/AdminShiftsManagementTypes';

function escapeCell(value: string | number | boolean): string {
  const raw = String(value);
  const text = typeof value === 'string' && /^[\s]*[=+@-]/.test(raw) ? `'${raw}` : raw;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function serializeAdminShiftsCsv(rows: readonly AdminShiftsShift[]): string {
  const columns = [
    ['id', (row: AdminShiftsShift) => row.id],
    ['name', (row: AdminShiftsShift) => row.name],
    ['start_time', (row: AdminShiftsShift) => row.startTime],
    ['end_time', (row: AdminShiftsShift) => row.endTime],
    ['occupancy', (row: AdminShiftsShift) => row.occupancy],
    ['capacity', (row: AdminShiftsShift) => row.capacity],
    ['active', (row: AdminShiftsShift) => row.active],
  ] as const satisfies readonly (readonly [string, (row: AdminShiftsShift) => string | number | boolean])[];
  return [columns.map(([header]) => header).join(','), ...rows.map((row) => columns.map(([, value]) => escapeCell(value(row))).join(','))].join('\r\n');
}
