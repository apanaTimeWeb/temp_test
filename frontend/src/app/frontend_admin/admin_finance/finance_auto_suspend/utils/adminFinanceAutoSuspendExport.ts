import type { AdminFinanceAutoSuspendSuspendedStudent } from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';
import { toast } from 'sonner';

function escapeCsv(v: unknown) {
  const s = String(v ?? '');
  return /^[\u0000-\u0020]*[=+\-@]/.test(s)
    ? `'"${s.replace(/"/g, '""')}"`
    : `"${s.replace(/"/g, '""')}"`;
}

export function exportAutoSuspendCsv(sortedRows: readonly AdminFinanceAutoSuspendSuspendedStudent[]) {
  const headers = ['Student Name', 'Smart ID', 'Seat', 'Shift', 'Branch', 'Pending Dues (INR)', 'Days Overdue', 'Suspended Since', 'Phone']
    .map(escapeCsv)
    .join(',');

  const rows = sortedRows
    .map((s) => [s.studentName, s.smartId, s.seat, s.shift, s.branch, s.duesAmount, s.daysOverdue, s.suspendedSince, s.phone || ''].map(escapeCsv).join(','))
    .join('\r\n');

  const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = Object.assign(document.createElement('a'), {
    href: url,
    download: `defaulters_auto_suspended_${new Date().toISOString().slice(0, 10)}.csv`,
    hidden: true,
  });
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success('Suspended defaulters list exported to CSV successfully', { id: 'admin-auto-suspend-export-csv' });
}
