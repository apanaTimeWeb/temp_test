import type { ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesTypes';
import { sanitizeManagerPaymentPromisesCsvCell } from '@/app/frontend_manager/manager_finance/finance_payment_promises/utils/ManagerFinancePaymentPromisesCsv';

export function formatPromiseInr(amountInMajor: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountInMajor);
}

export function getPromiseMajorUnits(promisedAmount: number): number {
  return promisedAmount >= 1000 ? Math.round(promisedAmount / 100) : promisedAmount;
}

export function exportPaymentPromisesCsv(rows: ManagerFinancePaymentPromisesPaymentPromiseSample[]): void {
  const headers = [
    'Student Name',
    'Smart ID',
    'Phone',
    'Promised Amount (INR)',
    'Expected Date',
    'Days Until Due',
    'Status',
    'Times Changed',
    'Fulfilled Date',
    'Remarks',
  ];
  const csvLines = [headers.join(',')];
  for (const p of rows) {
    csvLines.push(
      [
        sanitizeManagerPaymentPromisesCsvCell(p.studentName),
        sanitizeManagerPaymentPromisesCsvCell(p.smartId),
        sanitizeManagerPaymentPromisesCsvCell(p.phone),
        sanitizeManagerPaymentPromisesCsvCell(String(getPromiseMajorUnits(p.promisedAmount))),
        sanitizeManagerPaymentPromisesCsvCell(p.expectedDate),
        sanitizeManagerPaymentPromisesCsvCell(String(p.daysUntilDue)),
        sanitizeManagerPaymentPromisesCsvCell(p.status),
        sanitizeManagerPaymentPromisesCsvCell(String(p.timesChanged)),
        sanitizeManagerPaymentPromisesCsvCell(p.fulfilledDate || '—'),
        sanitizeManagerPaymentPromisesCsvCell(p.remarks || ''),
      ].join(',')
    );
  }
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `payment_promises_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function openPromiseWhatsAppReminder(promise: ManagerFinancePaymentPromisesPaymentPromiseSample): void {
  const rawPhone = promise.phone || '9876543210';
  let digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  const targetPhone = digits.length === 10 ? `91${digits}` : digits;
  const formattedAmt = formatPromiseInr(getPromiseMajorUnits(promise.promisedAmount));
  const msg = encodeURIComponent(
    `Hello ${promise.studentName}, gentle reminder from Library regarding your committed fee payment of ${formattedAmt} due on ${promise.expectedDate}. Please clear dues to maintain seat access. Thank you!`
  );
  const popup = window.open(`https://wa.me/${targetPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  if (popup) popup.opener = null;
}

export function dispatchBulkPromiseWhatsApp(promises: ManagerFinancePaymentPromisesPaymentPromiseSample[]): void {
  promises.forEach((promise, i) => {
    setTimeout(() => {
      if (i === 0) {
        openPromiseWhatsAppReminder(promise);
      }
    }, i * 300);
  });
}
