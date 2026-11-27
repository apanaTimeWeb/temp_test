import { sanitizeManagerSubscriptionsCsvCell } from '@/app/frontend_manager/manager_finance/finance_subscriptions/utils/ManagerFinanceSubscriptionsCsv';

export function formatSubscriptionInr(amountMajor: number, decimals = 0): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amountMajor);
}

export function exportSubscriptionsCsv(
  rows: Array<{
    studentName: string;
    smartId: string;
    plan: string;
    shift: string;
    startDate: string;
    endDate: string;
    daysLeft: number;
    base: number;
    discount: number;
    total: number;
    paid: number;
    due: number;
    status: string;
  }>
): void {
  const headers = ['Student', 'Smart ID', 'Plan', 'Shift', 'Start Date', 'End Date', 'Days Left', 'Base', 'Discount', 'Total', 'Paid', 'Due', 'Status'];
  const csvLines = [headers.join(',')];
  for (const row of rows) {
    csvLines.push(
      [
        sanitizeManagerSubscriptionsCsvCell(row.studentName),
        sanitizeManagerSubscriptionsCsvCell(row.smartId),
        sanitizeManagerSubscriptionsCsvCell(row.plan),
        sanitizeManagerSubscriptionsCsvCell(row.shift),
        sanitizeManagerSubscriptionsCsvCell(row.startDate),
        sanitizeManagerSubscriptionsCsvCell(row.endDate),
        sanitizeManagerSubscriptionsCsvCell(String(row.daysLeft)),
        sanitizeManagerSubscriptionsCsvCell(String(row.base)),
        sanitizeManagerSubscriptionsCsvCell(String(row.discount)),
        sanitizeManagerSubscriptionsCsvCell(String(row.total)),
        sanitizeManagerSubscriptionsCsvCell(String(row.paid)),
        sanitizeManagerSubscriptionsCsvCell(String(row.due)),
        sanitizeManagerSubscriptionsCsvCell(row.status),
      ].join(',')
    );
  }
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `subscriptions_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
