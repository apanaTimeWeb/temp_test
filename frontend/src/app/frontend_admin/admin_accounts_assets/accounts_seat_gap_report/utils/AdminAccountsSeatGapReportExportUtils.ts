import type { AdminAccountingSeatGapRow } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/types/AdminAccountsSeatGapReportTypes';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_seat_gap_report/utils/AdminAccountsSeatGapReportFormatCurrency';

function escapeAdminAccountingCsvCell(value: unknown): string {
  let text = String(value ?? '');
  if (typeof value === 'string' && /^[\u0000-\u0020]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

/** Exports the visible seat-gap rows in the same formatted INR units shown by the table. */
export function buildAdminAccountsSeatGapReportCsv(rows: readonly AdminAccountingSeatGapRow[]): string {
  const data: readonly (readonly unknown[])[] = [
    ['Seat No', 'Shift', 'Floor', 'Last Occupied', 'Gap Days', 'Revenue Loss (INR)', 'Status'],
    ...rows.map((row) => [row.seatNo, row.shift, row.floor, row.lastOccupied, row.gapDays, formatAdminAccountingCurrency(row.revenueLoss), row.status]),
  ];
  return `\uFEFF${data.map((row) => row.map(escapeAdminAccountingCsvCell).join(',')).join('\r\n')}`;
}

/** Starts a CSV download while preserving the URL until the browser has consumed the Blob. */
export function downloadAdminAccountingCsv(filename: string, csv: string): void {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
