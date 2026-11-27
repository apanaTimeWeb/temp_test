import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';

export interface InvoiceCalculations {
  invoiceNumber: string;
  totalAmount: number;
  taxableAmount: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
}

export function calculateInvoiceAmounts(payment: AdminFinancePayment): InvoiceCalculations {
  const invoiceNumber = `INV-${payment.receiptNumber.replace(/^REC-/, '')}`;
  const totalAmount = payment.amount;
  const taxableAmount = Math.round(totalAmount / 1.18);
  const gstAmount = totalAmount - taxableAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;

  return { invoiceNumber, totalAmount, taxableAmount, gstAmount, cgst, sgst };
}

export const ADMIN_FINANCE_INVOICE_CSS = `
  @page { size: A4; margin: 15mm; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 13px; }
  .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px; }
  .logo-area { font-size: 22px; font-weight: 800; color: #047857; }
  .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: #dcfce7; color: #166534; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
  .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
  .card-title { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b; margin-bottom: 6px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
  th { background: #047857; color: #fff; padding: 10px; text-align: left; font-size: 12px; }
  td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
  .totals-table { width: 280px; margin-left: auto; margin-bottom: 30px; }
  .totals-table td { padding: 6px 10px; }
  .grand-total { font-size: 16px; font-weight: 800; color: #047857; border-top: 2px solid #059669; }
  .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #94a3b8; text-align: center; }
`;
