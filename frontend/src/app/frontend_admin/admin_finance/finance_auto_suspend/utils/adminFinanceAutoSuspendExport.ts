import type {
  AdminFinanceAutoSuspendSuspendedStudent,
  SuspendSortField,
} from '@/app/frontend_admin/admin_finance/finance_auto_suspend/types/AdminFinanceAutoSuspendTypes';
import { toast } from 'sonner';

function escapeCsvCell(value: unknown): string {
  const text = String(value ?? '');
  return /^[\u0000-\u0020]*[=+\-@]/.test(text)
    ? `'"${text.replace(/"/g, '""')}"`
    : `"${text.replace(/"/g, '""')}"`;
}

export function filterAndSortSuspendedStudents(
  suspended: AdminFinanceAutoSuspendSuspendedStudent[],
  opts: {
    searchQuery: string;
    shiftFilter: string;
    overdueFilter: string;
    isAllBranches: boolean;
    selectedBranch: { name: string } | null;
    sortField: SuspendSortField | null;
    sortDirection: 'asc' | 'desc';
  }
): { filtered: AdminFinanceAutoSuspendSuspendedStudent[]; sortedRows: AdminFinanceAutoSuspendSuspendedStudent[] } {
  const { searchQuery, shiftFilter, overdueFilter, isAllBranches, selectedBranch, sortField, sortDirection } = opts;
  const q = searchQuery.trim().toLowerCase();
  const minDays = overdueFilter === 'all' ? 0 : Number(overdueFilter);
  const filtered = suspended.filter((s) => {
    const matchBranch = isAllBranches || !selectedBranch || !s.branch || s.branch.toLowerCase().includes(selectedBranch.name.toLowerCase());
    const matchShift = shiftFilter === 'all' || s.shift.toLowerCase() === shiftFilter.toLowerCase();
    const matchOverdue = s.daysOverdue >= minDays;
    const matchSearch =
      !q ||
      s.studentName.toLowerCase().includes(q) ||
      s.smartId.toLowerCase().includes(q) ||
      s.seat.toLowerCase().includes(q) ||
      s.shift.toLowerCase().includes(q) ||
      (s.phone && s.phone.includes(q)) ||
      (s.branch && s.branch.toLowerCase().includes(q));
    return matchBranch && matchShift && matchOverdue && matchSearch;
  });
  if (!sortField) return { filtered, sortedRows: filtered };
  const sortedRows = [...filtered].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const cmp =
      typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
    return sortDirection === 'asc' ? cmp : -cmp;
  });
  return { filtered, sortedRows };
}

export function exportAutoSuspendCsv(rows: AdminFinanceAutoSuspendSuspendedStudent[]): void {
  const headers = ['Student Name', 'Smart ID', 'Seat', 'Shift', 'Branch', 'Pending Dues (INR)', 'Plan', 'Days Overdue', 'Suspended Since', 'Phone']
    .map(escapeCsvCell)
    .join(',');
  const body = rows
    .map((s) => [s.studentName, s.smartId, s.seat, s.shift, s.branch || '', s.duesAmount || 1500, s.planName || '', s.daysOverdue, s.suspendedSince, s.phone || ''].map(escapeCsvCell).join(','))
    .join('\r\n');
  const blob = new Blob([`\uFEFF${headers}\r\n${body}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = Object.assign(document.createElement('a'), {
    href: url,
    download: `auto_suspend_defaulters_${new Date().toISOString().slice(0, 10)}.csv`,
    hidden: true,
  });
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success('Suspended students list exported to CSV', { id: 'admin-auto-suspend-csv-export' });
}
