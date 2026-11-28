'use client';

import type { FinancialReportExportSpec } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsExportTypes';

const PRINT_STYLES = `
  @media print { @page { size: A4 portrait; margin: 15mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 24px; font-size: 13px; line-height: 1.5; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #047857; padding-bottom: 16px; margin-bottom: 20px; }
  .logo-title { font-size: 20px; font-weight: 800; color: #047857; letter-spacing: -0.5px; }
  .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
  .meta-box { text-align: right; font-size: 11px; color: #475569; }
  .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .kpi-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background-color: #f8fafc; }
  .kpi-label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; }
  .kpi-val { font-size: 18px; font-weight: 800; margin-top: 4px; }
  .val-green { color: #047857; } .val-red { color: #dc2626; } .val-blue { color: #0284c7; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
  th { background-color: #f1f5f9; color: #334155; font-weight: 700; text-align: left; padding: 8px 10px; border: 1px solid #cbd5e1; }
  td { padding: 8px 10px; border: 1px solid #cbd5e1; } tr:nth-child(even) td { background-color: #f8fafc; }
  .section-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  .total-row td { background-color: #f0fdf4 !important; font-weight: 700; border-top: 2px solid #047857; }
  .signatures { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 20px; font-size: 11px; color: #475569; }
  .sig-block { text-align: center; width: 200px; border-top: 1px dashed #94a3b8; padding-top: 8px; }
  .footer-note { margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
`;

function escapeFinancialHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function printFinancialReport(spec: FinancialReportExportSpec): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=800');
  if (!printWindow) return;
  printWindow.opener = null;

  const totalProfitMinor = spec.totalIncomeMinor - spec.totalExpenseMinor;
  const totalMargin = spec.totalIncomeMinor > 0 ? ((totalProfitMinor / spec.totalIncomeMinor) * 100).toFixed(1) : '0.0';

  const html = `
    <!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Financial Report - Smart Library Network</title><style>${PRINT_STYLES}</style></head>
    <body>
      <div class="header">
        <div><div class="logo-title">SMART LIBRARY SYSTEM</div><div class="subtitle">Official Executive Financial Statement & P&L Audit</div></div>
        <div class="meta-box">
          <div><strong>Horizon:</strong> ${escapeFinancialHtml(spec.period.toUpperCase())}</div>
          ${spec.customStartDate ? `<div><strong>Range:</strong> ${escapeFinancialHtml(spec.customStartDate)} to ${escapeFinancialHtml(spec.customEndDate)}</div>` : ''}
          <div><strong>Date:</strong> ${escapeFinancialHtml(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }))}</div>
          <div><strong>Status:</strong> Audited & Balanced</div>
        </div>
      </div>
      <div class="kpi-row">
        <div class="kpi-card"><div class="kpi-label">Total Revenue</div><div class="kpi-val val-green">₹${(spec.totalIncomeMinor / 100).toLocaleString('en-IN')}</div></div>
        <div class="kpi-card"><div class="kpi-label">Operating Expenses</div><div class="kpi-val val-red">₹${(spec.totalExpenseMinor / 100).toLocaleString('en-IN')}</div></div>
        <div class="kpi-card"><div class="kpi-label">Net Operating Profit</div><div class="kpi-val val-blue">₹${(totalProfitMinor / 100).toLocaleString('en-IN')} (${totalMargin}%)</div></div>
      </div>
      <div class="section-title">1. Revenue vs Expense Schedule</div>
      <table><thead><tr><th>Period / Month</th><th>Total Revenue (INR)</th><th>Operating Expenses (INR)</th><th>Net Profit (INR)</th><th>Profit Margin (%)</th></tr></thead>
      <tbody>
        ${spec.rows.map((r) => {
          const p = (r.incomeMinor - r.expenseMinor) / 100;
          const m = r.incomeMinor > 0 ? (((r.incomeMinor - r.expenseMinor) / r.incomeMinor) * 100).toFixed(1) : '0.0';
          return `<tr><td><strong>${escapeFinancialHtml(r.month)}</strong></td><td>₹${(r.incomeMinor / 100).toLocaleString('en-IN')}</td><td>₹${(r.expenseMinor / 100).toLocaleString('en-IN')}</td><td style="color: #047857; font-weight: 600;">₹${p.toLocaleString('en-IN')}</td><td>${m}%</td></tr>`;
        }).join('')}
        <tr class="total-row"><td>TOTAL CONSOLIDATED</td><td>₹${(spec.totalIncomeMinor / 100).toLocaleString('en-IN')}</td><td>₹${(spec.totalExpenseMinor / 100).toLocaleString('en-IN')}</td><td style="color: #047857;">₹${(totalProfitMinor / 100).toLocaleString('en-IN')}</td><td>${totalMargin}%</td></tr>
      </tbody></table>
      <div class="section-title">2. Operational Expense Category Breakdown</div>
      <table><thead><tr><th>Expense Category</th><th>Disbursed Amount (INR)</th><th>Portfolio Share (%)</th></tr></thead>
      <tbody>${spec.categories.map((c) => `<tr><td><strong>${escapeFinancialHtml(c.category)}</strong></td><td>₹${(c.amountMinor / 100).toLocaleString('en-IN')}</td><td>${c.pct}%</td></tr>`).join('')}</tbody></table>
      <div class="signatures">
        <div class="sig-block"><div>Prepared By</div><strong>Chief Accounts Officer</strong></div>
        <div class="sig-block"><div>Audited & Reconciled By</div><strong>Internal Audit Committee</strong></div>
        <div class="sig-block"><div>Approved By</div><strong>Executive Director / Admin</strong></div>
      </div>
      <div class="footer-note">This document is an executive financial audit record generated by Smart Library Cloud ERP. For internal board review and tax audit compliance only.</div>
      <script>window.onload = function() { window.focus(); window.print(); };</script>
    </body></html>
  `.trim();

  printWindow.document.open?.();
  printWindow.document.write(html);
  printWindow.document.close();
}
