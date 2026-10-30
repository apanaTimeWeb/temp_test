import type { AdminStudentsStudent } from '@/app/frontend_admin/admin_members/members_students/types/AdminMembersStudentsTypes';

const COLUMNS = [
  ['id', 'id'], ['name', 'name'], ['phone', 'phone'], ['shift', 'shift'], ['seat', 'seat'],
  ['plan', 'plan'], ['joinDate', 'join_date'], ['expiryDate', 'expiry_date'], ['status', 'status'],
  ['branch', 'branch'], ['feeStatus', 'fee_status'], ['locker', 'locker'],
  ['consecutiveAbsent', 'consecutive_absent'], ['totalPaidMinor', 'total_paid_minor'], ['dueFeeMinor', 'due_fee_minor'], ['currencyCode', 'currency_code'],
] as const satisfies readonly (readonly [keyof AdminStudentsStudent, string])[];

function escapeCsvCell(value: string | number | undefined): string {
  const raw = value === undefined ? '' : String(value);
  const text = typeof value === 'string' && /^[\s]*[=+@-]/.test(raw) ? `'${raw}` : raw;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function serializeAdminStudentsCsv(rows: readonly AdminStudentsStudent[]): string {
  return [COLUMNS.map(([, header]) => header).join(','), ...rows.map((row) => COLUMNS.map(([key]) => escapeCsvCell(row[key])).join(','))].join('\r\n');
}
