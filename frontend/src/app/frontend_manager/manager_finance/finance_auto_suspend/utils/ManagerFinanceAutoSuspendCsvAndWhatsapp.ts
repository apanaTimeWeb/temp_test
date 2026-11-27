import type { ManagerFinanceAutoSuspendSuspendedStudent as SuspendedStudent } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendTypes';

function escapeCsvCell(value: unknown): string {
  const s = String(value ?? '');
  return /^[\u0000-\u0020]*[=+\-@]/.test(s) ? `'"${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`;
}

/** Export filtered suspended students to a sanitized CSV download. */
export function exportAutoSuspendCsv(rows: SuspendedStudent[]): void {
  const headers = ['Student Name', 'Smart ID', 'Seat', 'Shift', 'Days Overdue', 'Suspended Since'].map(escapeCsvCell).join(',');
  const csvRows = rows
    .map((s) => [s.studentName, s.smartId, s.seat, s.shift, s.daysOverdue, s.suspendedSince].map(escapeCsvCell).join(','))
    .join('\r\n');
  const blob = new Blob([`\uFEFF${headers}\r\n${csvRows}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = Object.assign(document.createElement('a'), {
    href: url,
    download: `suspended_students_${new Date().toISOString().slice(0, 10)}.csv`,
    hidden: true,
  });
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Dispatch WhatsApp overdue suspension reminder for filtered students. */
export function dispatchBulkSuspendedWhatsApp(rows: SuspendedStudent[]): void {
  rows.forEach((student, i) => {
    setTimeout(() => {
      const rawPhone = student.phone || '9876543210';
      let clean = rawPhone.replace(/\D/g, '');
      if (clean.length === 11 && clean.startsWith('0')) clean = clean.slice(1);
      const targetPhone = clean.length === 10 ? `91${clean}` : clean;
      const msg = encodeURIComponent(
        `Namaste ${student.studentName} (ID: ${student.smartId}),\n\nOfficial notice from Library Administration: Your library seat ${student.seat} (${student.shift} Shift) is suspended due to overdue fee payment (${student.daysOverdue} days overdue).\n\nPlease clear pending dues to restore your seat access immediately.\n— Library Management`
      );
      if (i === 0) {
        const popup = window.open(`https://wa.me/${targetPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
        if (popup) popup.opener = null;
      }
    }, i * 300);
  });
}
