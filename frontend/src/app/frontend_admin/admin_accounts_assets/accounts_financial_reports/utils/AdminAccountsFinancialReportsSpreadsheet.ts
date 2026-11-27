'use client';

import type { FinancialReportExportSpec } from '@/app/frontend_admin/admin_accounts_assets/accounts_financial_reports/utils/AdminAccountsFinancialReportsExportTypes';

function triggerSpreadsheetDownload(blob: Blob, filename: string): void {
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

export function exportFinancialReportCsv(spec: FinancialReportExportSpec): void {
  const pnlHeaders = ['Period / Month', 'Total Revenue (INR)', 'Operational Expenses (INR)', 'Net Profit (INR)', 'Profit Margin (%)'];
  const pnlRows = spec.rows.map((r) => {
    const profit = (r.incomeMinor - r.expenseMinor) / 100;
    const margin = r.incomeMinor > 0 ? (((r.incomeMinor - r.expenseMinor) / r.incomeMinor) * 100).toFixed(1) : '0.0';
    return [`"${r.month}"`, (r.incomeMinor / 100).toFixed(2), (r.expenseMinor / 100).toFixed(2), profit.toFixed(2), `${margin}%`];
  });
  const categoryHeaders = ['Expense Category', 'Disbursed Amount (INR)', 'Portfolio Share (%)'];
  const categoryRows = spec.categories.map((c) => [`"${c.category}"`, (c.amountMinor / 100).toFixed(2), `${c.pct}%`]);
  const totalProfitMinor = spec.totalIncomeMinor - spec.totalExpenseMinor;
  const totalMargin = spec.totalIncomeMinor > 0 ? ((totalProfitMinor / spec.totalIncomeMinor) * 100).toFixed(1) : '0.0';

  const csv = [
    'SMART LIBRARY FINANCIAL STATEMENT & PROFIT AND LOSS AUDIT REPORT',
    `Reporting Period,${spec.period}`,
    spec.customStartDate && spec.customEndDate ? `Custom Date Range,${spec.customStartDate} to ${spec.customEndDate}` : '',
    `Generated Date,${new Date().toISOString().slice(0, 10)}`,
    '',
    'SECTION 1: REVENUE AND EXPENSE SUMMARY',
    pnlHeaders.join(','),
    ...pnlRows.map((r) => r.join(',')),
    `"TOTAL",${(spec.totalIncomeMinor / 100).toFixed(2)},${(spec.totalExpenseMinor / 100).toFixed(2)},${(totalProfitMinor / 100).toFixed(2)},${totalMargin}%`,
    '',
    'SECTION 2: OPERATIONAL EXPENSE CATEGORY BREAKDOWN',
    categoryHeaders.join(','),
    ...categoryRows.map((r) => r.join(',')),
  ].filter(Boolean).join('\n');

  triggerSpreadsheetDownload(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `admin-financial-pnl-report-${spec.period}-${new Date().toISOString().slice(0, 10)}.csv`);
}

export function exportFinancialReportExcel(spec: FinancialReportExportSpec): void {
  const totalProfitMinor = spec.totalIncomeMinor - spec.totalExpenseMinor;
  const totalMargin = spec.totalIncomeMinor > 0 ? ((totalProfitMinor / spec.totalIncomeMinor) * 100).toFixed(1) : '0.0';

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; margin-bottom: 24px; }
        th { background-color: #047857; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #065f46; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; }
        .title { font-size: 16px; font-weight: bold; color: #047857; margin-bottom: 8px; }
        .meta { color: #475569; font-size: 12px; margin-bottom: 16px; }
        .subhead { font-size: 14px; font-weight: bold; color: #1e293b; margin-top: 18px; margin-bottom: 6px; }
        .profit { color: #059669; font-weight: bold; }
        .total-row { background-color: #f0fdf4; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="title">SMART LIBRARY SYSTEM - FINANCIAL STATEMENT & P&L REPORT</div>
      <div class="meta"><strong>Period:</strong> ${spec.period.toUpperCase()} ${spec.customStartDate ? `(${spec.customStartDate} to ${spec.customEndDate})` : ''} | <strong>Generated:</strong> ${new Date().toLocaleString('en-IN')}</div>
      <div class="subhead">1. Revenue & Operating Performance Statement</div>
      <table>
        <thead><tr><th>Period / Month</th><th>Total Revenue (INR)</th><th>Operating Expenses (INR)</th><th>Net Profit (INR)</th><th>Profit Margin (%)</th></tr></thead>
        <tbody>
          ${spec.rows.map((r) => {
            const p = (r.incomeMinor - r.expenseMinor) / 100;
            const m = r.incomeMinor > 0 ? (((r.incomeMinor - r.expenseMinor) / r.incomeMinor) * 100).toFixed(1) : '0.0';
            return `<tr><td>${r.month}</td><td>₹${(r.incomeMinor / 100).toLocaleString('en-IN')}</td><td>₹${(r.expenseMinor / 100).toLocaleString('en-IN')}</td><td class="profit">₹${p.toLocaleString('en-IN')}</td><td>${m}%</td></tr>`;
          }).join('')}
          <tr class="total-row"><td>TOTAL</td><td>₹${(spec.totalIncomeMinor / 100).toLocaleString('en-IN')}</td><td>₹${(spec.totalExpenseMinor / 100).toLocaleString('en-IN')}</td><td class="profit">₹${(totalProfitMinor / 100).toLocaleString('en-IN')}</td><td>${totalMargin}%</td></tr>
        </tbody>
      </table>
      <div class="subhead">2. Expense Category Breakdown</div>
      <table>
        <thead><tr><th>Expense Category</th><th>Disbursed Amount (INR)</th><th>Portfolio Share (%)</th></tr></thead>
        <tbody>${spec.categories.map((c) => `<tr><td>${c.category}</td><td>₹${(c.amountMinor / 100).toLocaleString('en-IN')}</td><td>${c.pct}%</td></tr>`).join('')}</tbody>
      </table>
    </body>
    </html>
  `.trim();

  triggerSpreadsheetDownload(new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }), `admin-financial-pnl-report-${spec.period}-${new Date().toISOString().slice(0, 10)}.xls`);
}
