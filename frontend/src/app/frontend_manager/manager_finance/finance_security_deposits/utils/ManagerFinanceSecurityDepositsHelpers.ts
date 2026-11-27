import type { ManagerFinanceSecurityDepositsSampleDeposit } from '@/app/frontend_manager/manager_finance/finance_security_deposits/hooks/ManagerFinanceSecurityDepositsDemoRepository';
import { sanitizeManagerSecurityDepositsCsvCell } from '@/app/frontend_manager/manager_finance/finance_security_deposits/utils/ManagerFinanceSecurityDepositsCsv';

export function formatDepositInr(amountMajor: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountMajor);
}

export function getDepositCurrencySymbol(): string {
  return formatDepositInr(0).replace(/[0-9.,\s]/g, '') || 'INR';
}

export function exportSecurityDepositsCsv(rows: ManagerFinanceSecurityDepositsSampleDeposit[]): void {
  const headers = [
    'Student Name',
    'Smart ID',
    'Deposit Amount (INR)',
    'Status',
    'Collected By',
    'Collected Date',
    'Deduction Amount (INR)',
    'Deduction Reason',
    'Refunded Date',
  ];
  const csvLines = [headers.join(',')];
  for (const d of rows) {
    csvLines.push(
      [
        sanitizeManagerSecurityDepositsCsvCell(d.studentName),
        sanitizeManagerSecurityDepositsCsvCell(d.smartId),
        sanitizeManagerSecurityDepositsCsvCell(String(d.depositAmount)),
        sanitizeManagerSecurityDepositsCsvCell(d.status),
        sanitizeManagerSecurityDepositsCsvCell(d.collectedBy),
        sanitizeManagerSecurityDepositsCsvCell(d.collectedDate),
        sanitizeManagerSecurityDepositsCsvCell(String(d.deductionAmount || 0)),
        sanitizeManagerSecurityDepositsCsvCell(d.deductionReason || '—'),
        sanitizeManagerSecurityDepositsCsvCell(d.refundedDate || '—'),
      ].join(',')
    );
  }
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `security_deposits_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
