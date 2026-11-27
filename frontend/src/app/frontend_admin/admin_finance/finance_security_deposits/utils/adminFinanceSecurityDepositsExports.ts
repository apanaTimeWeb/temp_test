import type {
  AdminDepositsTimeHorizon,
  AdminFinanceSecurityDeposit,
  DepositSortField,
  SecurityDepositStatus,
} from '@/app/frontend_admin/admin_finance/finance_security_deposits/types/AdminFinanceSecurityDepositsTypes';
import { toast } from 'sonner';

function escapeCsvCell(value: unknown): string {
  const s = String(value ?? '');
  return /^[\u0000-\u0020]*[=+\-@]/.test(s) ? `'"${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`;
}

export function filterDepositsByTimeHorizon(
  deposits: AdminFinanceSecurityDeposit[],
  timeHorizon: AdminDepositsTimeHorizon,
  customStartDate: string,
  customEndDate: string
): AdminFinanceSecurityDeposit[] {
  if (timeHorizon === 'all') return deposits;
  const now = new Date();
  return deposits.filter((d) => {
    const recDate = new Date(d.collectedDate);
    if (Number.isNaN(recDate.getTime())) return true;
    if (timeHorizon === 'today') return recDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
    if (timeHorizon === 'this_week') {
      const diffDays = (now.getTime() - recDate.getTime()) / (1000 * 3600 * 24);
      return diffDays >= 0 && diffDays <= 7;
    }
    if (timeHorizon === 'this_month') return recDate.getFullYear() === now.getFullYear() && recDate.getMonth() === now.getMonth();
    const dateStr = recDate.toISOString().slice(0, 10);
    if (customStartDate && dateStr < customStartDate) return false;
    if (customEndDate && dateStr > customEndDate) return false;
    return true;
  });
}

export function filterAndSortSecurityDeposits(
  timeFilteredDeposits: AdminFinanceSecurityDeposit[],
  opts: {
    isAllBranches: boolean;
    selectedBranch: { name: string } | null;
    statusFilter: 'all' | SecurityDepositStatus;
    searchQuery: string;
    sortField: DepositSortField | null;
    sortDirection: 'asc' | 'desc';
  }
): { filtered: AdminFinanceSecurityDeposit[]; sortedRows: AdminFinanceSecurityDeposit[] } {
  const { isAllBranches, selectedBranch, statusFilter, searchQuery, sortField, sortDirection } = opts;
  const q = searchQuery.trim().toLowerCase();
  const filtered = timeFilteredDeposits.filter((d) => {
    const matchBranch = isAllBranches || !selectedBranch || !d.branch || d.branch.toLowerCase().includes(selectedBranch.name.toLowerCase());
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchSearch =
      !q ||
      d.studentName.toLowerCase().includes(q) ||
      d.smartId.toLowerCase().includes(q) ||
      (d.seat && d.seat.toLowerCase().includes(q)) ||
      (d.phone && d.phone.includes(q)) ||
      (d.branch && d.branch.toLowerCase().includes(q));
    return matchBranch && matchStatus && matchSearch;
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

export function getTimeHorizonLabel(timeHorizon: AdminDepositsTimeHorizon, customStartDate: string, customEndDate: string): string {
  switch (timeHorizon) {
    case 'today': return 'Today';
    case 'this_week': return 'This Week';
    case 'this_month': return 'This Month';
    case 'custom': return customStartDate && customEndDate ? `${customStartDate} - ${customEndDate}` : 'Custom Range';
    default: return 'All Time';
  }
}

export function exportSecurityDepositsCsv(rows: AdminFinanceSecurityDeposit[]): void {
  const headers = ['Student Name', 'Smart ID', 'Seat', 'Branch', 'Deposit Amount (INR)', 'Status', 'Collected By', 'Collected Date', 'Deduction Amount (INR)', 'Deduction Reason', 'Refunded Date', 'Phone']
    .map(escapeCsvCell)
    .join(',');
  const body = rows
    .map((d) => [d.studentName, d.smartId, d.seat || 'N/A', d.branch || '', d.depositAmount, d.status, d.collectedBy, d.collectedDate, d.deductionAmount || 0, d.deductionReason || '', d.refundedDate || '', d.phone || ''].map(escapeCsvCell).join(','))
    .join('\r\n');
  const blob = new Blob([`\uFEFF${headers}\r\n${body}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = Object.assign(document.createElement('a'), {
    href: url,
    download: `security_deposits_ledger_${new Date().toISOString().slice(0, 10)}.csv`,
    hidden: true,
  });
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success('Security deposits ledger exported to CSV successfully', { id: 'security-deposits-csv-export' });
}
