import type { DailySettlementRecord } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import { escapeSettlementHtml } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/adminAccountsDailySettlementCsvExcel';

export function printDailySettlementSummary(
  records: DailySettlementRecord[],
  scopeLabel: string,
  dateModeLabel: string,
): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=850,height=750');
  if (!printWindow) {
    window.print();
    return;
  }
  printWindow.opener = null;
  const totalHandover = records.reduce((sum, r) => sum + r.actualHandoverCash, 0);
  const totalVariance = records.reduce((sum, r) => sum + r.difference, 0);
  const html = `
    <!DOCTYPE html><html><head><title>Smart Library - Daily Cash Handover Closing Summary</title>
      <style>
        @page { size: landscape; margin: 12mm; }
        body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 11px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 15px; }
        .title { font-size: 18px; font-weight: 800; color: #047857; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
        th { background: #047857; color: #fff; padding: 8px 6px; text-align: left; }
        td { padding: 6px; border-bottom: 1px solid #e2e8f0; } tr:nth-child(even) { background-color: #f8fafc; }
        .footer { border-top: 1px solid #e2e8f0; margin-top: 25px; padding-top: 10px; font-size: 10px; color: #64748b; display: flex; justify-content: space-between; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="title">SMART LIBRARY NETWORK · DAILY SETTLEMENT REPORT</div>
          <div style="font-size: 11px; color: #64748b;">Scope: ${escapeSettlementHtml(scopeLabel)} · Filter: ${escapeSettlementHtml(dateModeLabel)}</div>
        </div>
        <div style="text-align: right;">
          <div><strong>Records:</strong> ${records.length}</div>
          <div><strong>Total Handover Cash:</strong> ₹${(totalHandover / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div><strong>Net Variance:</strong> ₹${(totalVariance / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>
      <table>
        <thead><tr>
          <th>Date</th><th>Shift</th><th>Branch</th><th>Manager</th>
          <th style="text-align: right;">Opening</th><th style="text-align: right;">Cash In</th>
          <th style="text-align: right;">UPI In</th><th style="text-align: right;">Expenses</th>
          <th style="text-align: right;">Handover</th><th style="text-align: right;">Variance</th><th>Status</th>
        </tr></thead>
        <tbody>${records.map((r) => `
          <tr>
            <td>${escapeSettlementHtml(r.date)}</td><td>${escapeSettlementHtml(r.shiftName)}</td><td>${escapeSettlementHtml(r.branchName)}</td><td>${escapeSettlementHtml(r.managerName)}</td>
            <td style="text-align: right; font-family: monospace;">₹${(r.openingCash / 100).toFixed(2)}</td>
            <td style="text-align: right; font-family: monospace;">₹${(r.cashCollected / 100).toFixed(2)}</td>
            <td style="text-align: right; font-family: monospace;">₹${(r.upiCollected / 100).toFixed(2)}</td>
            <td style="text-align: right; font-family: monospace; color:#b91c1c;">₹${(r.expensesPaid / 100).toFixed(2)}</td>
            <td style="text-align: right; font-family: monospace; font-weight: bold; color:#047857;">₹${(r.actualHandoverCash / 100).toFixed(2)}</td>
            <td style="text-align: right; font-family: monospace; font-weight: bold; color:${r.difference < 0 ? '#b91c1c' : '#047857'};">₹${(r.difference / 100).toFixed(2)}</td>
            <td>${escapeSettlementHtml(r.status.replace(/_/g, ' '))}</td>
          </tr>`).join('')}</tbody>
      </table>
      <div class="footer"><span>Treasury & Accounts Audit Division · Smart Library Systems</span><span>Generated on: ${escapeSettlementHtml(new Date().toLocaleDateString('en-IN'))}</span></div>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
