import type { AdminFinanceRefundApiRecord } from '@/app/frontend_admin/admin_finance/finance_refunds/schemas/AdminFinanceRefundsSchema';
import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import { formatDate } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsFormat';
import { toast } from 'sonner';

function escapeHtml(value: string | number | undefined): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function mapAdminFinanceRefund(record: AdminFinanceRefundApiRecord): AdminFinanceRefund {
  const rec = record as Record<string, unknown>;
  return {
    id: record.id,
    studentName: record.studentName,
    smartId: record.smartId ?? '—',
    exitDate: record.exitDate,
    depositHeld: record.depositHeld,
    deductionAmount: record.deductionAmount,
    netRefund: record.netRefund,
    currencyCode: record.currencyCode ?? 'INR',
    amountUnit: record.amountUnit ?? 'major',
    status: record.status,
    processedDate: record.processedDate,
    paymentMethod: record.paymentMethod,
    rejectionReason: record.rejectionReason,
    branchName: typeof rec.branchName === 'string' ? rec.branchName : undefined,
    branchId: typeof rec.branchId === 'string' ? rec.branchId : undefined,
    studentPhone: typeof rec.studentPhone === 'string' ? rec.studentPhone : (typeof rec.phone === 'string' ? rec.phone : '9876543220'),
    studentEmail:
      typeof rec.studentEmail === 'string'
        ? rec.studentEmail
        : typeof rec.email === 'string'
          ? rec.email
          : `${record.studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
  };
}

export function buildRefundNotificationMessage(refund: AdminFinanceRefund, detailed = false): string {
  if (refund.status === 'approved') {
    return `Dear ${refund.studentName}, your Smart Library security deposit refund of ₹${refund.netRefund.toLocaleString('en-IN')} has been APPROVED! ${detailed ? 'Disbursement method' : 'Method'}: ${refund.paymentMethod || 'UPI/Bank'}. Ref: ${refund.id}.`;
  }
  if (refund.status === 'rejected') {
    return `Dear ${refund.studentName}, your${detailed ? ' Smart Library' : ''} deposit refund request has been REJECTED. Reason: ${refund.rejectionReason || (detailed ? 'Pending damages or dues' : 'Pending damages/dues')}. Ref: ${refund.id}.`;
  }
  if (detailed && refund.status === 'processed') {
    return `Dear ${refund.studentName}, your Smart Library security deposit refund of ₹${refund.netRefund.toLocaleString('en-IN')} has been DISBURSED via ${refund.paymentMethod || 'UPI/Bank'}! Transaction UTR: ${refund.transactionUtr || 'N/A'}. Receipt No: ${refund.receiptNumber || `RCT-REF-${refund.id}`}.`;
  }
  if (detailed) {
    return `Dear ${refund.studentName}, your Smart Library deposit refund request (Ref: ${refund.id}) is currently under review by Accounts.`;
  }
  return `Dear ${refund.studentName}, your security deposit refund status is currently ${refund.status.toUpperCase()}. Net amount: ₹${refund.netRefund.toLocaleString('en-IN')}. Ref: ${refund.id}.`;
}

export function buildRefundDetailPrintHtml(refund: AdminFinanceRefund): string {
  const settledDate = refund.disbursedAt || refund.processedDate;
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Security Deposit Refund Voucher - ${escapeHtml(refund.id)}</title>
        <style>
          @page { size: A5 landscape; margin: 10mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px; }
          .logo { font-size: 16px; font-weight: 800; color: #047857; text-transform: uppercase; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
          .box-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th { background: #047857; color: #fff; padding: 6px; text-align: left; font-size: 11px; }
          td { padding: 6px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
          .net-box { background: #ecfdf5; border: 2px solid #059669; border-radius: 6px; padding: 10px; text-align: right; margin-bottom: 15px; }
          .footer { border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SMART LIBRARY NETWORK</div>
            <div style="font-size: 11px; color: #64748b;">Treasury & Security Deposit Settlement Division · Branch: ${escapeHtml(refund.branchName ?? 'Downtown Central')}</div>
          </div>
          <div style="text-align: right;">
            <span class="badge" style="background:#dcfce7; color:#15803d;">REFUND SETTLEMENT VOUCHER</span>
            <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">Ref: ${escapeHtml(refund.id)}</div>
            <div style="font-size: 10px; color: #64748b;">Exit Date: ${refund.exitDate ? escapeHtml(formatDate(refund.exitDate)) : 'N/A'}</div>
          </div>
        </div>

        <div class="grid">
          <div class="box">
            <div class="box-title">Student Information</div>
            <div style="font-size: 13px; font-weight: bold;">${escapeHtml(refund.studentName)}</div>
            <div style="color: #475569;">Smart ID: <strong>${escapeHtml(refund.smartId)}</strong></div>
            <div style="color: #475569;">Branch: ${escapeHtml(refund.branchName ?? 'Downtown Central')}</div>
          </div>
          <div class="box">
            <div class="box-title">Settlement & Banking Details</div>
            <div>Receipt No: <strong>${escapeHtml(refund.receiptNumber ?? `RCT-REF-${refund.id}`)}</strong></div>
            <div>Transaction UTR: <strong style="font-family: monospace; color: #4338ca;">${escapeHtml(refund.transactionUtr ?? 'Pending Transfer')}</strong></div>
            <div>Method: <strong>${escapeHtml(refund.paymentMethod ?? 'Direct UPI Transfer')}</strong></div>
            <div>Status: <strong style="text-transform: uppercase;">${escapeHtml(refund.status)}</strong></div>
            ${settledDate ? `<div>Settled Date: ${escapeHtml(formatDate(settledDate))}</div>` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Initial Security Deposit Held</td>
              <td style="text-align: right; font-weight: bold;">₹${refund.depositHeld.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>Deductions (Damages / Key replacement / Dues)</td>
              <td style="text-align: right; color: ${refund.deductionAmount > 0 ? '#b91c1c' : '#64748b'};">
                ${refund.deductionAmount > 0 ? `-₹${refund.deductionAmount.toLocaleString('en-IN')}` : '₹0 (None)'}
              </td>
            </tr>
            ${refund.rejectionReason ? `<tr><td colspan="2" style="color:#b91c1c;"><strong>Reason:</strong> ${escapeHtml(refund.rejectionReason)}</td></tr>` : ''}
          </tbody>
        </table>

        <div class="net-box">
          <span style="font-size: 12px; color: #065f46; font-weight: bold;">NET REFUND DISBURSED: </span>
          <span style="font-size: 18px; font-weight: 800; color: #047857;">₹${refund.netRefund.toLocaleString('en-IN')}</span>
        </div>

        <div class="footer">
          <span>Verified by Smart Library Branch Accounts</span>
          <span>Authorized Signature: ____________________</span>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `;
}

function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const EXPORT_HEADERS = [
  'Ref ID',
  'Student Name',
  'Smart ID',
  'Branch',
  'Exit Date',
  'Deposit Held (INR)',
  'Deductions (INR)',
  'Net Refund (INR)',
  'Status',
  'Payment Method',
  'Processed Date',
  'Rejection Reason',
];

export function exportAdminFinanceRefundsCsv(refunds: AdminFinanceRefund[], fallbackBranchName?: string): void {
  const rows = refunds.map((r) => [
    r.id,
    `"${r.studentName.replace(/"/g, '""')}"`,
    r.smartId,
    `"${(r.branchName ?? fallbackBranchName ?? 'Downtown Central').replace(/"/g, '""')}"`,
    r.exitDate ? formatDate(r.exitDate) : '—',
    r.depositHeld,
    r.deductionAmount,
    r.netRefund,
    r.status.toUpperCase(),
    r.paymentMethod ? `"${r.paymentMethod.replace(/"/g, '""')}"` : '—',
    r.processedDate ? formatDate(r.processedDate) : '—',
    r.rejectionReason ? `"${r.rejectionReason.replace(/"/g, '""')}"` : '—',
  ]);
  const csv = [EXPORT_HEADERS.join(','), ...rows.map((row) => row.join(','))].join('\n');
  triggerFileDownload(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    `admin-finance-refunds-${new Date().toISOString().slice(0, 10)}.csv`
  );
  toast.success(`Exported ${refunds.length} refund records to CSV`, { id: 'refunds-csv-export' });
}

export function exportAdminFinanceRefundsExcel(refunds: AdminFinanceRefund[], fallbackBranchName?: string): void {
  const rows = refunds.map((r) => [
    r.id,
    r.studentName,
    r.smartId,
    r.branchName ?? fallbackBranchName ?? 'Downtown Central',
    r.exitDate ? formatDate(r.exitDate) : '—',
    r.depositHeld,
    r.deductionAmount,
    r.netRefund,
    r.status.toUpperCase(),
    r.paymentMethod ?? '—',
    r.processedDate ? formatDate(r.processedDate) : '—',
    r.rejectionReason ?? '—',
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Refunds</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #047857; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #065f46; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #ecfdf5; }
      </style>
    </head>
    <body>
      <table>
        <thead><tr>${EXPORT_HEADERS.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `.trim();
  triggerFileDownload(
    new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }),
    `admin-finance-refunds-${new Date().toISOString().slice(0, 10)}.xls`
  );
  toast.success(`Exported ${refunds.length} refunds to Excel (.xls) for CA/Accounts`, { id: 'refunds-excel-export' });
}
