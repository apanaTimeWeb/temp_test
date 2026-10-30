import type { AdminSubscriptionsDemoSubscription } from '@/app/frontend_admin/admin_finance/finance_subscriptions/types/AdminFinanceSubscriptionsTypes';

const COLUMNS = [
  ['id', 'id'],
  ['studentName', 'student_name'],
  ['smartId', 'smart_id'],
  ['plan', 'plan'],
  ['shift', 'shift'],
  ['startDate', 'start_date'],
  ['endDate', 'end_date'],
  ['daysLeft', 'days_left'],
  ['base', 'base_minor_units'],
  ['discount', 'discount_minor_units'],
  ['total', 'total_minor_units'],
  ['paid', 'paid_minor_units'],
  ['due', 'due_minor_units'],
  ['status', 'status'],
] as const satisfies readonly (readonly [keyof AdminSubscriptionsDemoSubscription, string])[];

function escapeCsvCell(value: string | number): string {
  const raw = String(value);
  const text = typeof value === 'string' && /^[\s]*[=+@-]/.test(raw) ? `'${raw}` : raw;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function serializeAdminSubscriptionsCsv(rows: readonly AdminSubscriptionsDemoSubscription[]): string {
  return [
    COLUMNS.map(([, header]) => header).join(','),
    ...rows.map((row) => COLUMNS.map(([key]) => escapeCsvCell(row[key])).join(',')),
  ].join('\r\n');
}
