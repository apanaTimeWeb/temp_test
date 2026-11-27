import type { Entry } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/hooks/ManagerAccountsDailySettlementDemoRepository';

const INR_FIXED_TWO = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
});

function escapeCsvCell(val: unknown): string {
  let str = String(val ?? '');
  if (/^[\u0000-\u0020]*[=+\-@]/.test(str)) str = `'${str}`;
  return `"${str.replace(/"/g, '""')}"`;
}

export function exportDailySettlementsCsv(entries: Entry[], dateScopeLabel: string): void {
  const headers = ['Shift', 'Opening (INR)', 'Cash (INR)', 'UPI (INR)', 'Expenses (INR)', 'Closing (INR)', 'Settled By', 'Status']
    .map(escapeCsvCell)
    .join(',');
  const rows = entries
    .map((e) =>
      [
        e.shift,
        INR_FIXED_TWO.format(e.openingBalance / 100),
        INR_FIXED_TWO.format(e.cashCollected / 100),
        INR_FIXED_TWO.format(e.upiCollected / 100),
        INR_FIXED_TWO.format(e.expenses / 100),
        INR_FIXED_TWO.format(e.closingBalance / 100),
        e.settledBy || '',
        e.status,
      ]
        .map(escapeCsvCell)
        .join(',')
    )
    .join('\r\n');

  const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  const safeScope = dateScopeLabel.toLowerCase().replace(/[^a-z0-9_-]+/g, '_');
  anchor.download = `daily_settlement_${safeScope}_${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
