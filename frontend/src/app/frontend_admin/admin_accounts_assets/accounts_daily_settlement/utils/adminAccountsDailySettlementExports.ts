import type { DailySettlementRecord } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import {
  formatPaiseToRupees,
  formatSettlementDate,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/AdminAccountsDailySettlementFormatters';
import { toast } from 'sonner';

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function triggerDownload(blob: Blob, filename: string): void {
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

const SETTLEMENT_HEADERS = [
  'Date',
  'Shift',
  'Branch',
  'Manager',
  'Opening Cash (INR)',
  'Cash Collected (INR)',
  'UPI Collected (INR)',
  'Expenses Paid (INR)',
  'Expected Closing (INR)',
  'Actual Handover (INR)',
  'Variance (INR)',
  'Status',
  'Approved By',
];

export function exportDailySettlementsCsv(records: DailySettlementRecord[]): void {
  const rows = records.map((r) => [
    r.date,
    `"${r.shiftName.replace(/"/g, '""')}"`,
    `"${r.branchName.replace(/"/g, '""')}"`,
    `"${r.managerName.replace(/"/g, '""')}"`,
    (r.openingCash / 100).toFixed(2),
    (r.cashCollected / 100).toFixed(2),
    (r.upiCollected / 100).toFixed(2),
    (r.expensesPaid / 100).toFixed(2),
    (r.expectedClosingCash / 100).toFixed(2),
    (r.actualHandoverCash / 100).toFixed(2),
    (r.difference / 100).toFixed(2),
    r.status,
    `"${(r.approvedBy ?? '').replace(/"/g, '""')}"`,
  ]);
  const csv = [SETTLEMENT_HEADERS.join(','), ...rows.map((row) => row.join(','))].join('\n');
  triggerDownload(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    `admin-daily-settlement-history-${new Date().toISOString().slice(0, 10)}.csv`
  );
  toast.success(`Exported ${records.length} settlement records to CSV`, {
    id: 'daily-settlement-csv-export',
  });
}

export function exportDailySettlementsExcel(records: DailySettlementRecord[]): void {
  const rows = records.map((r) => [
    r.date,
    r.shiftName,
    r.branchName,
    r.managerName,
    (r.openingCash / 100).toFixed(2),
    (r.cashCollected / 100).toFixed(2),
    (r.upiCollected / 100).toFixed(2),
    (r.expensesPaid / 100).toFixed(2),
    (r.expectedClosingCash / 100).toFixed(2),
    (r.actualHandoverCash / 100).toFixed(2),
    (r.difference / 100).toFixed(2),
    r.status.replace(/_/g, ' '),
    r.approvedBy ?? 'Pending Audit',
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Settlements</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
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
        <thead><tr>${SETTLEMENT_HEADERS.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </body>
    </html>
  `.trim();
  triggerDownload(
    new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }),
    `admin-daily-settlement-history-${new Date().toISOString().slice(0, 10)}.xls`
  );
  toast.success(`Exported ${records.length} settlement records to Excel (.xls)`, {
    id: 'daily-settlement-excel-export',
  });
}

export function printDailySettlementSummary(
  records: DailySettlementRecord[],
  scopeLabel: string,
  dateModeLabel: string
): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=850,height=750');
  if (!printWindow) {
    window.print();
    return;
  }
  const totalHandover = records.reduce((sum, r) => sum + r.actualHandoverCash, 0);
  const totalVariance = records.reduce((sum, r) => sum + r.difference, 0);
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Smart Library - Daily Cash Handover Closing Summary</title>
        <style>
          @page { size: landscape; margin: 12mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 11px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 15px; }
          .title { font-size: 18px; font-weight: 800; color: #047857; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
          th { background: #047857; color: #fff; padding: 8px 6px; text-align: left; }
          td { padding: 6px; border-bottom: 1px solid #e2e8f0; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { border-top: 1px solid #e2e8f0; margin-top: 25px; padding-top: 10px; font-size: 10px; color: #64748b; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">SMART LIBRARY NETWORK · DAILY SETTLEMENT REPORT</div>
            <div style="font-size: 11px; color: #64748b;">Scope: ${escapeHtml(scopeLabel)} · Filter: ${escapeHtml(dateModeLabel)}</div>
          </div>
          <div style="text-align: right;">
            <div><strong>Records:</strong> ${records.length}</div>
            <div><strong>Total Handover Cash:</strong> ₹${(totalHandover / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <div><strong>Net Variance:</strong> ₹${(totalVariance / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Shift</th><th>Branch</th><th>Manager</th>
              <th style="text-align: right;">Opening</th><th style="text-align: right;">Cash In</th>
              <th style="text-align: right;">UPI In</th><th style="text-align: right;">Expenses</th>
              <th style="text-align: right;">Handover</th><th style="text-align: right;">Variance</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${records.map((r) => `
              <tr>
                <td>${escapeHtml(r.date)}</td><td>${escapeHtml(r.shiftName)}</td><td>${escapeHtml(r.branchName)}</td><td>${escapeHtml(r.managerName)}</td>
                <td style="text-align: right; font-family: monospace;">₹${(r.openingCash / 100).toFixed(2)}</td>
                <td style="text-align: right; font-family: monospace;">₹${(r.cashCollected / 100).toFixed(2)}</td>
                <td style="text-align: right; font-family: monospace;">₹${(r.upiCollected / 100).toFixed(2)}</td>
                <td style="text-align: right; font-family: monospace; color:#b91c1c;">₹${(r.expensesPaid / 100).toFixed(2)}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color:#047857;">₹${(r.actualHandoverCash / 100).toFixed(2)}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color:${r.difference < 0 ? '#b91c1c' : '#047857'};">₹${(r.difference / 100).toFixed(2)}</td>
                <td>${escapeHtml(r.status.replace(/_/g, ' '))}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div class="footer">
          <span>Treasury & Accounts Audit Division · Smart Library Systems</span>
          <span>Generated on: ${escapeHtml(new Date().toLocaleDateString('en-IN'))}</span>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function printDailySettlementVoucher(record: DailySettlementRecord): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=750,height=800');
  if (!printWindow) {
    window.print();
    return;
  }
  const isShortage = record.difference < 0;
  const isSurplus = record.difference > 0;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Daily Cash Handover Voucher - ${escapeHtml(record.branchName)} (${escapeHtml(record.date)})</title>
        <style>
          @page { size: A5 landscape; margin: 10mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px; }
          .logo { font-size: 16px; font-weight: 800; color: #047857; text-transform: uppercase; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
          .box-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
          th { background: #047857; color: #fff; padding: 6px; text-align: left; }
          td { padding: 6px; border-bottom: 1px solid #e2e8f0; }
          .highlight-row { background: #f0fdf4; font-weight: bold; }
          .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; margin-top: 20px; }
          .signature-box { width: 200px; border-top: 1px solid #000; text-align: center; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SMART LIBRARY NETWORK</div>
            <div style="font-size: 11px; color: #64748b;">Daily Cash Closing & Handover Voucher</div>
          </div>
          <div style="text-align: right;">
            <span class="badge" style="background:#dcfce7; color:#15803d;">DAILY SETTLEMENT</span>
            <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">Date: ${escapeHtml(formatSettlementDate(record.date))}</div>
            <div style="font-size: 10px; color: #64748b;">Shift: ${escapeHtml(record.shiftName)}</div>
          </div>
        </div>
        <div class="grid">
          <div class="box">
            <div class="box-title">Branch & Shift Details</div>
            <div style="font-size: 13px; font-weight: bold;">${escapeHtml(record.branchName)}</div>
            <div style="color: #475569;">Handed Over By: <strong>${escapeHtml(record.managerName)}</strong></div>
            ${record.managerNotes ? `<div style="color: #64748b; font-size: 10px; margin-top: 4px;">Notes: ${escapeHtml(record.managerNotes)}</div>` : ''}
          </div>
          <div class="box">
            <div class="box-title">Audit Status</div>
            <div>Status: <strong style="text-transform: uppercase;">${escapeHtml(record.status.replace(/_/g, ' '))}</strong></div>
            <div>Approved By: <strong>${escapeHtml(record.approvedBy ?? 'Pending Audit')}</strong></div>
            ${record.bankReferenceNumber ? `<div>Bank Ref: ${escapeHtml(record.bankReferenceNumber)}</div>` : ''}
          </div>
        </div>
        <table>
          <thead><tr><th>Cash Ledger Particulars</th><th style="text-align: right;">Amount (INR)</th></tr></thead>
          <tbody>
            <tr><td>Opening Petty Cash Balance</td><td style="text-align: right; font-family: monospace;">${escapeHtml(formatPaiseToRupees(record.openingCash))}</td></tr>
            <tr><td>Daily Counter Cash Collected</td><td style="text-align: right; font-family: monospace;">+${escapeHtml(formatPaiseToRupees(record.cashCollected))}</td></tr>
            <tr><td>Daily UPI / Digital Collections (Direct to Bank)</td><td style="text-align: right; font-family: monospace; color: #4f46e5;">${escapeHtml(formatPaiseToRupees(record.upiCollected))}</td></tr>
            <tr><td>Petty Cash Expenses Paid</td><td style="text-align: right; font-family: monospace; color: #b91c1c;">-${escapeHtml(formatPaiseToRupees(record.expensesPaid))}</td></tr>
            <tr style="border-top: 2px solid #cbd5e1;"><td><strong>Expected Drawer Cash</strong></td><td style="text-align: right; font-family: monospace; font-weight: bold;">${escapeHtml(formatPaiseToRupees(record.expectedClosingCash))}</td></tr>
            <tr class="highlight-row"><td><strong>Actual Cash Handed Over to Admin/Bank</strong></td><td style="text-align: right; font-family: monospace; font-size: 13px; color: #047857;">${escapeHtml(formatPaiseToRupees(record.actualHandoverCash))}</td></tr>
            <tr><td>Cash Variance (Discrepancy)</td><td style="text-align: right; font-family: monospace; font-weight: bold; color: ${isShortage ? '#b91c1c' : isSurplus ? '#047857' : '#64748b'};">${record.difference === 0 ? '₹0.00 (Exact Match)' : escapeHtml(formatPaiseToRupees(record.difference))}</td></tr>
            ${record.resolutionAction ? `<tr style="background:#fff1f2;"><td><strong>Discrepancy Resolution Strategy</strong></td><td style="text-align: right; font-weight: bold; color: #9f1239;">${record.resolutionAction === 'DEDUCT_SALARY' ? 'Shortage scheduled for deduction from manager monthly payroll' : record.resolutionAction === 'CARRY_FORWARD' ? 'Shortage carried forward to tomorrow opening balance' : record.resolutionAction === 'IMMEDIATE_DEPOSIT' ? 'Difference reimbursed on spot at counter' : 'Waived as operational loss'}</td></tr>` : ''}
          </tbody>
        </table>
        <div class="footer">
          <div class="signature-box"><span>Branch Manager Signature</span><br/><small style="color: #64748b;">(${escapeHtml(record.managerName)})</small></div>
          <div class="signature-box"><span>Admin / Auditor Signature</span><br/><small style="color: #64748b;">(Smart Library Treasury)</small></div>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
