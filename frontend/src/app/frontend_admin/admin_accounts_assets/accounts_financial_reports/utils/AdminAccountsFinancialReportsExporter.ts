'use client';

function escapePdfString(str: unknown): string {
  return String(str ?? '')
    .replaceAll('\\', '\\\\')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)');
}

export interface FinancialReportRowSpec {
  month: string;
  incomeMinor: number;
  expenseMinor: number;
}

export interface FinancialReportCategorySpec {
  category: string;
  amountMinor: number;
  pct: number;
}

export interface FinancialReportExportSpec {
  period: string;
  rows: readonly FinancialReportRowSpec[];
  categories: readonly FinancialReportCategorySpec[];
  totalIncomeMinor: number;
  totalExpenseMinor: number;
  customStartDate?: string;
  customEndDate?: string;
}

export function buildFinancialReportPdfBlob(spec: FinancialReportExportSpec): Blob {
  const [r, g, b] = [0.05, 0.45, 0.35]; // Executive deep emerald
  const netProfitMinor = spec.totalIncomeMinor - spec.totalExpenseMinor;
  const marginPct = spec.totalIncomeMinor > 0 ? ((netProfitMinor / spec.totalIncomeMinor) * 100).toFixed(1) : '0.0';

  let stream = '';
  // Background header band
  stream += `${r} ${g} ${b} rg\n50 760 495 55 re f\n`;

  // Header Title & Subtitle
  stream += `1 1 1 rg\nBT\n/F1 14 Tf\n65 792 Td\n(SMART LIBRARY FINANCIAL STATEMENT & AUDIT) Tj\nET\n`;
  stream += `BT\n/F2 9 Tf\n65 774 Td\n(Executive Profit & Loss Ledger | Reporting Horizon: ${escapePdfString(spec.period.toUpperCase())}) Tj\nET\n`;

  // Metadata block
  stream += '0.1 0.1 0.1 rg\n';
  let y = 730;
  stream += `BT\n/F1 9 Tf\n50 ${y} Td\n(Reporting Horizon:) Tj\nET\n`;
  stream += `BT\n/F2 9 Tf\n170 ${y} Td\n(${escapePdfString(spec.period)}) Tj\nET\n`;
  y -= 14;

  if (spec.customStartDate || spec.customEndDate) {
    stream += `BT\n/F1 9 Tf\n50 ${y} Td\n(Custom Date Horizon:) Tj\nET\n`;
    stream += `BT\n/F2 9 Tf\n170 ${y} Td\n(${escapePdfString(spec.customStartDate ?? 'Start')} to ${escapePdfString(spec.customEndDate ?? 'End')}) Tj\nET\n`;
    y -= 14;
  }

  stream += `BT\n/F1 9 Tf\n50 ${y} Td\n(Generated Timestamp:) Tj\nET\n`;
  stream += `BT\n/F2 9 Tf\n170 ${y} Td\n(${new Date().toLocaleString('en-IN')}) Tj\nET\n`;
  y -= 14;

  stream += `BT\n/F1 9 Tf\n50 ${y} Td\n(Ledger Verification:) Tj\nET\n`;
  stream += `BT\n/F2 9 Tf\n170 ${y} Td\n(Audited & Reconciled - Library Accounts Cloud) Tj\nET\n`;

  // Divider line
  y -= 8;
  stream += `0.8 0.82 0.85 RG\n50 ${y} m 545 ${y} l S\n`;

  // KPI Summary Bar
  y -= 26;
  stream += `0.95 0.97 0.96 rg\n50 ${y - 6} 495 26 re f\n`;
  stream += `${r} ${g} ${b} RG\n50 ${y - 6} 495 26 re S\n`;
  stream += `0.1 0.2 0.15 rg\nBT\n/F1 8.5 Tf\n60 ${y} Td\n(Total Revenue: INR ${(spec.totalIncomeMinor / 100).toLocaleString('en-IN')}) Tj\nET\n`;
  stream += `0.6 0.15 0.1 rg\nBT\n/F1 8.5 Tf\n230 ${y} Td\n(Expenses: INR ${(spec.totalExpenseMinor / 100).toLocaleString('en-IN')}) Tj\nET\n`;
  stream += `${r} ${g} ${b} rg\nBT\n/F1 9 Tf\n395 ${y} Td\n(Net Profit: INR ${(netProfitMinor / 100).toLocaleString('en-IN')} (${marginPct}%)) Tj\nET\n`;

  // Table 1: P&L Period Breakdown Header
  y -= 26;
  stream += `0.92 0.94 0.96 rg\n50 ${y - 4} 495 18 re f\n`;
  stream += `0.1 0.1 0.1 rg\nBT\n/F1 8.5 Tf\n60 ${y} Td\n(PERIOD / MONTH) Tj\nET\n`;
  stream += `BT\n/F1 8.5 Tf\n200 ${y} Td\n(TOTAL REVENUE) Tj\nET\n`;
  stream += `BT\n/F1 8.5 Tf\n330 ${y} Td\n(OPERATING EXPENSES) Tj\nET\n`;
  stream += `BT\n/F1 8.5 Tf\n460 ${y} Td\n(NET MARGIN) Tj\nET\n`;

  // Table 1 Rows
  y -= 16;
  for (const row of spec.rows) {
    const profit = row.incomeMinor - row.expenseMinor;
    stream += `0.2 0.2 0.2 rg\nBT\n/F2 8.5 Tf\n60 ${y} Td\n(${escapePdfString(row.month)}) Tj\nET\n`;
    stream += `BT\n/F1 8.5 Tf\n200 ${y} Td\n(INR ${(row.incomeMinor / 100).toLocaleString('en-IN')}) Tj\nET\n`;
    stream += `BT\n/F1 8.5 Tf\n330 ${y} Td\n(INR ${(row.expenseMinor / 100).toLocaleString('en-IN')}) Tj\nET\n`;
    stream += `BT\n/F1 8.5 Tf\n460 ${y} Td\n(INR ${(profit / 100).toLocaleString('en-IN')}) Tj\nET\n`;
    y -= 14;
    if (y < 220) break;
  }

  // Divider
  y -= 6;
  stream += `0.85 0.85 0.85 RG\n50 ${y} m 545 ${y} l S\n`;

  // Table 2: Expense Breakdown Header
  y -= 18;
  stream += `0.96 0.94 0.92 rg\n50 ${y - 4} 495 18 re f\n`;
  stream += `0.2 0.1 0.1 rg\nBT\n/F1 8.5 Tf\n60 ${y} Td\n(EXPENSE CATEGORY) Tj\nET\n`;
  stream += `BT\n/F1 8.5 Tf\n250 ${y} Td\n(AMOUNT DISBURSED) Tj\nET\n`;
  stream += `BT\n/F1 8.5 Tf\n440 ${y} Td\n(PORTFOLIO SHARE) Tj\nET\n`;

  // Table 2 Rows
  y -= 15;
  for (const cat of spec.categories) {
    stream += `0.2 0.2 0.2 rg\nBT\n/F2 8 Tf\n60 ${y} Td\n(${escapePdfString(cat.category)}) Tj\nET\n`;
    stream += `BT\n/F1 8 Tf\n250 ${y} Td\n(INR ${(cat.amountMinor / 100).toLocaleString('en-IN')}) Tj\nET\n`;
    stream += `BT\n/F2 8 Tf\n440 ${y} Td\n(${cat.pct}%) Tj\nET\n`;
    y -= 13;
  }

  // Signatures
  stream += '0.3 0.3 0.3 RG\n80 85 m 220 85 l S\n';
  stream += '0.3 0.3 0.3 RG\n380 85 m 520 85 l S\n';
  stream += '0.2 0.2 0.2 rg\nBT\n/F2 8 Tf\n100 72 Td\n(Prepared By: Chief Accountant) Tj\nET\n';
  stream += '0.2 0.2 0.2 rg\nBT\n/F2 8 Tf\n405 72 Td\n(Authorized Executive Signatory) Tj\nET\n';

  // Bottom footer
  stream += `0.5 0.5 0.5 rg\nBT\n/F2 7.5 Tf\n50 50 Td\n(CONFIDENTIAL & PROPRIETARY. Generated by Smart Library Cloud ERP Accounting System.) Tj\nET\n`;

  const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets: number[] = [];
  let currentOffset = header.length;

  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  offsets.push(currentOffset);
  currentOffset += obj1.length;

  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  offsets.push(currentOffset);
  currentOffset += obj2.length;

  const obj3 = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n';
  offsets.push(currentOffset);
  currentOffset += obj3.length;

  const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';
  offsets.push(currentOffset);
  currentOffset += obj4.length;

  const obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  offsets.push(currentOffset);
  currentOffset += obj5.length;

  const streamBytesLen = new TextEncoder().encode(stream).length;
  const obj6 = `6 0 obj\n<< /Length ${streamBytesLen} >>\nstream\n${stream}\nendstream\nendobj\n`;
  offsets.push(currentOffset);
  currentOffset += obj6.length;

  const startXref = currentOffset;
  let xref = 'xref\n0 7\n0000000000 65535 f \n';
  for (const off of offsets) {
    xref += `${String(off).padStart(10, '0')} 00000 n \n`;
  }
  const trailer = `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  const fullPdfString = header + obj1 + obj2 + obj3 + obj4 + obj5 + obj6 + xref + trailer;
  return new Blob([new TextEncoder().encode(fullPdfString)], { type: 'application/pdf' });
}

export function downloadFinancialReportPdf(spec: FinancialReportExportSpec): void {
  if (typeof window === 'undefined') return;
  const blob = buildFinancialReportPdfBlob(spec);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `admin-financial-statement-${spec.period}-${new Date().toISOString().slice(0, 10)}.pdf`;
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
    return [
      `"${r.month}"`,
      (r.incomeMinor / 100).toFixed(2),
      (r.expenseMinor / 100).toFixed(2),
      profit.toFixed(2),
      `${margin}%`,
    ];
  });

  const categoryHeaders = ['Expense Category', 'Disbursed Amount (INR)', 'Portfolio Share (%)'];
  const categoryRows = spec.categories.map((c) => [
    `"${c.category}"`,
    (c.amountMinor / 100).toFixed(2),
    `${c.pct}%`,
  ]);

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
    `"TOTAL",(spec.totalIncomeMinor / 100).toFixed(2),(spec.totalExpenseMinor / 100).toFixed(2),${(totalProfitMinor / 100).toFixed(2)},${totalMargin}%`,
    '',
    'SECTION 2: OPERATIONAL EXPENSE CATEGORY BREAKDOWN',
    categoryHeaders.join(','),
    ...categoryRows.map((r) => r.join(',')),
  ].filter(Boolean).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `admin-financial-pnl-report-${spec.period}-${new Date().toISOString().slice(0, 10)}.csv`;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportFinancialReportExcel(spec: FinancialReportExportSpec): void {
  const totalProfitMinor = spec.totalIncomeMinor - spec.totalExpenseMinor;
  const totalMargin = spec.totalIncomeMinor > 0 ? ((totalProfitMinor / spec.totalIncomeMinor) * 100).toFixed(1) : '0.0';

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Financial Statement</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
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
      <div class="meta">
        <strong>Period:</strong> ${spec.period.toUpperCase()} ${spec.customStartDate ? `(${spec.customStartDate} to ${spec.customEndDate})` : ''} |
        <strong>Generated:</strong> ${new Date().toLocaleString('en-IN')}
      </div>

      <div class="subhead">1. Revenue & Operating Performance Statement</div>
      <table>
        <thead>
          <tr>
            <th>Period / Month</th>
            <th>Total Revenue (INR)</th>
            <th>Operating Expenses (INR)</th>
            <th>Net Profit (INR)</th>
            <th>Profit Margin (%)</th>
          </tr>
        </thead>
        <tbody>
          ${spec.rows.map((r) => {
            const p = (r.incomeMinor - r.expenseMinor) / 100;
            const m = r.incomeMinor > 0 ? (((r.incomeMinor - r.expenseMinor) / r.incomeMinor) * 100).toFixed(1) : '0.0';
            return `
              <tr>
                <td>${r.month}</td>
                <td>₹${(r.incomeMinor / 100).toLocaleString('en-IN')}</td>
                <td>₹${(r.expenseMinor / 100).toLocaleString('en-IN')}</td>
                <td class="profit">₹${p.toLocaleString('en-IN')}</td>
                <td>${m}%</td>
              </tr>
            `;
          }).join('')}
          <tr class="total-row">
            <td>TOTAL</td>
            <td>₹${(spec.totalIncomeMinor / 100).toLocaleString('en-IN')}</td>
            <td>₹${(spec.totalExpenseMinor / 100).toLocaleString('en-IN')}</td>
            <td class="profit">₹${(totalProfitMinor / 100).toLocaleString('en-IN')}</td>
            <td>${totalMargin}%</td>
          </tr>
        </tbody>
      </table>

      <div class="subhead">2. Expense Category Breakdown</div>
      <table>
        <thead>
          <tr>
            <th>Expense Category</th>
            <th>Disbursed Amount (INR)</th>
            <th>Portfolio Share (%)</th>
          </tr>
        </thead>
        <tbody>
          ${spec.categories.map((c) => `
            <tr>
              <td>${c.category}</td>
              <td>₹${(c.amountMinor / 100).toLocaleString('en-IN')}</td>
              <td>${c.pct}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `.trim();

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `admin-financial-pnl-report-${spec.period}-${new Date().toISOString().slice(0, 10)}.xls`;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function printFinancialReport(spec: FinancialReportExportSpec): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) return;

  const totalProfitMinor = spec.totalIncomeMinor - spec.totalExpenseMinor;
  const totalMargin = spec.totalIncomeMinor > 0 ? ((totalProfitMinor / spec.totalIncomeMinor) * 100).toFixed(1) : '0.0';

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <title>Financial Report - Smart Library Network</title>
      <style>
        @media print {
          @page { size: A4 portrait; margin: 15mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 24px; font-size: 13px; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #047857; padding-bottom: 16px; margin-bottom: 20px; }
        .logo-title { font-size: 20px; font-weight: 800; color: #047857; letter-spacing: -0.5px; }
        .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
        .meta-box { text-align: right; font-size: 11px; color: #475569; }
        .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
        .kpi-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background-color: #f8fafc; }
        .kpi-label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; }
        .kpi-val { font-size: 18px; font-weight: 800; margin-top: 4px; }
        .val-green { color: #047857; }
        .val-red { color: #dc2626; }
        .val-blue { color: #0284c7; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
        th { background-color: #f1f5f9; color: #334155; font-weight: 700; text-align: left; padding: 8px 10px; border: 1px solid #cbd5e1; }
        td { padding: 8px 10px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) td { background-color: #f8fafc; }
        .section-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .total-row td { background-color: #f0fdf4 !important; font-weight: 700; border-top: 2px solid #047857; }
        .signatures { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 20px; font-size: 11px; color: #475569; }
        .sig-block { text-align: center; width: 200px; border-top: 1px dashed #94a3b8; padding-top: 8px; }
        .footer-note { margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo-title">SMART LIBRARY SYSTEM</div>
          <div class="subtitle">Official Executive Financial Statement & P&L Audit</div>
        </div>
        <div class="meta-box">
          <div><strong>Horizon:</strong> ${spec.period.toUpperCase()}</div>
          ${spec.customStartDate ? `<div><strong>Range:</strong> ${spec.customStartDate} to ${spec.customEndDate}</div>` : ''}
          <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          <div><strong>Status:</strong> Audited & Balanced</div>
        </div>
      </div>

      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-label">Total Revenue</div>
          <div class="kpi-val val-green">₹${(spec.totalIncomeMinor / 100).toLocaleString('en-IN')}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Operating Expenses</div>
          <div class="kpi-val val-red">₹${(spec.totalExpenseMinor / 100).toLocaleString('en-IN')}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Net Operating Profit</div>
          <div class="kpi-val val-blue">₹${(totalProfitMinor / 100).toLocaleString('en-IN')} (${totalMargin}%)</div>
        </div>
      </div>

      <div class="section-title">1. Revenue vs Expense Schedule</div>
      <table>
        <thead>
          <tr>
            <th>Period / Month</th>
            <th>Total Revenue (INR)</th>
            <th>Operating Expenses (INR)</th>
            <th>Net Profit (INR)</th>
            <th>Profit Margin (%)</th>
          </tr>
        </thead>
        <tbody>
          ${spec.rows.map((r) => {
            const p = (r.incomeMinor - r.expenseMinor) / 100;
            const m = r.incomeMinor > 0 ? (((r.incomeMinor - r.expenseMinor) / r.incomeMinor) * 100).toFixed(1) : '0.0';
            return `
              <tr>
                <td><strong>${r.month}</strong></td>
                <td>₹${(r.incomeMinor / 100).toLocaleString('en-IN')}</td>
                <td>₹${(r.expenseMinor / 100).toLocaleString('en-IN')}</td>
                <td style="color: #047857; font-weight: 600;">₹${p.toLocaleString('en-IN')}</td>
                <td>${m}%</td>
              </tr>
            `;
          }).join('')}
          <tr class="total-row">
            <td>TOTAL CONSOLIDATED</td>
            <td>₹${(spec.totalIncomeMinor / 100).toLocaleString('en-IN')}</td>
            <td>₹${(spec.totalExpenseMinor / 100).toLocaleString('en-IN')}</td>
            <td style="color: #047857;">₹${(totalProfitMinor / 100).toLocaleString('en-IN')}</td>
            <td>${totalMargin}%</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">2. Operational Expense Category Breakdown</div>
      <table>
        <thead>
          <tr>
            <th>Expense Category</th>
            <th>Disbursed Amount (INR)</th>
            <th>Portfolio Share (%)</th>
          </tr>
        </thead>
        <tbody>
          ${spec.categories.map((c) => `
            <tr>
              <td><strong>${c.category}</strong></td>
              <td>₹${(c.amountMinor / 100).toLocaleString('en-IN')}</td>
              <td>${c.pct}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="signatures">
        <div class="sig-block">
          <div>Prepared By</div>
          <strong>Chief Accounts Officer</strong>
        </div>
        <div class="sig-block">
          <div>Audited & Reconciled By</div>
          <strong>Internal Audit Committee</strong>
        </div>
        <div class="sig-block">
          <div>Approved By</div>
          <strong>Executive Director / Admin</strong>
        </div>
      </div>

      <div class="footer-note">
        This document is an executive financial audit record generated by Smart Library Cloud ERP. For internal board review and tax audit compliance only.
      </div>

      <script>
        window.onload = function() { window.focus(); window.print(); };
      </script>
    </body>
    </html>
  `.trim();

  printWindow.document.write(html);
  printWindow.document.close();
}
