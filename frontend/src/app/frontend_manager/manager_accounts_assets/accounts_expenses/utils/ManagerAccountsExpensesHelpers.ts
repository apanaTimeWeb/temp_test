import type { ManagerExpensesTimeHorizon } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/components/manager_accounts_expenses_views/ManagerAccountsExpensesPage';
import type { Expense } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';

const INR_RUPEES_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const INR_FIXED_TWO = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
});

export function formatExpensesInrRupees(rupees: number): string {
  return INR_RUPEES_FORMATTER.format(rupees);
}

export function buildInitialDemoExpenses(mockRows: Expense[]): Expense[] {
  const today = new Date();
  const offsets = [0, 1, 3, 7, 14, 25];
  return mockRows.map((exp, idx) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (offsets[idx] ?? 25));
    return { ...exp, date: d.toISOString().slice(0, 10) };
  });
}

export function isExpenseInTimeHorizon(
  dateStr: string,
  timeHorizon: ManagerExpensesTimeHorizon,
  customStartDate: string,
  customEndDate: string
): boolean {
  if (timeHorizon === 'all') return true;
  const parsed = Date.parse(dateStr);
  if (Number.isNaN(parsed)) return true;
  const d = new Date(parsed);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  if (timeHorizon === 'today') return d.getTime() >= startOfToday && d.getTime() < startOfToday + 86400000;
  if (timeHorizon === 'this_week') {
    const startOfWeek = startOfToday - ((now.getDay() || 7) - 1) * 86400000;
    return d.getTime() >= startOfWeek && d.getTime() <= startOfWeek + 7 * 86400000;
  }
  if (timeHorizon === 'this_month') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  if (timeHorizon === 'custom') {
    if (customStartDate && d.getTime() < new Date(`${customStartDate}T00:00:00`).getTime()) return false;
    if (customEndDate && d.getTime() > new Date(`${customEndDate}T23:59:59`).getTime()) return false;
    return true;
  }
  return true;
}

export function getExpensesTimeHorizonLabel(
  timeHorizon: ManagerExpensesTimeHorizon,
  customStartDate: string,
  customEndDate: string
): string {
  switch (timeHorizon) {
    case 'all': return 'All Time';
    case 'today': return 'Today';
    case 'this_week': return 'This Week';
    case 'this_month': return 'This Month';
    case 'custom': return customStartDate && customEndDate ? `${customStartDate} to ${customEndDate}` : 'Custom Range';
    default: return 'This Month';
  }
}

function escapeCsvCell(v: unknown): string {
  const s = String(v ?? '');
  return /^[\u0000-\u0020]*[=+\-@]/.test(s) ? `'"${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`;
}

export function exportExpensesToCsv(expenses: Expense[], timeHorizonLabel: string): void {
  const h = ['Date', 'Description', 'Category', 'Amount (INR)', 'Payment Mode', 'Paid By'].map(escapeCsvCell).join(',');
  const r = expenses
    .map((e) => [e.date, e.description, e.category, INR_FIXED_TWO.format(e.amount / 100), e.mode, e.paidBy].map(escapeCsvCell).join(','))
    .join('\r\n');
  const blob = new Blob([`\uFEFF${h}\r\n${r}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `expenses_ledger_${timeHorizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`,
    hidden: true,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
