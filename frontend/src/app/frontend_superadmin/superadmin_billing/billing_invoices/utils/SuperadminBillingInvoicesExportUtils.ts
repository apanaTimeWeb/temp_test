'use client';

import type { SuperadminBillingInvoiceSample } from '../types/SuperadminBillingInvoicesTypes';

/**
 * Downloads invoices as an Excel (.xls) spreadsheet with HTML formatting.
 */
export function downloadSuperadminInvoicesExcel(
  invoices: SuperadminBillingInvoiceSample[],
  filename = 'superadmin_invoices_statement.xls'
): void {
  const tableRows = invoices
    .map((inv, idx) => {
      const isPaid = inv.status === 'Paid';
      const statusColor = isPaid ? '#059669' : '#e11d48';
      return `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; font-family: monospace;">${inv.id}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">${inv.tenant}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${inv.date}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold;">₹${inv.amount.toLocaleString('en-IN')}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: ${statusColor}; font-weight: bold;">${inv.status}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${inv.method}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-family: monospace; font-size: 10pt;">${inv.gst}</td>
      </tr>`;
    })
    .join('');

  const html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Billing Invoices</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
      table { border-collapse: collapse; width: 100%; }
      th { background-color: #4f46e5; color: #ffffff; padding: 10px; font-weight: bold; border: 1px solid #4338ca; text-align: left; }
    </style>
  </head>
  <body>
    <h2>Smart Library SaaS - Invoices & Billing Statement</h2>
    <p>Export Date: ${new Date().toLocaleString('en-IN')} | Total Invoices: ${invoices.length}</p>
    <table>
      <thead>
        <tr>
          <th>Invoice ID</th>
          <th>Tenant / Library</th>
          <th>Invoice Date</th>
          <th>Amount (INR)</th>
          <th>Status</th>
          <th>Payment Method</th>
          <th>GST Identification</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  </body>
  </html>`;

  const blob = new Blob(['\uFEFF' + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Opens a print dialog for invoice roster.
 */
export function printSuperadminInvoicesRoster(
  invoices: SuperadminBillingInvoiceSample[],
  title = 'Invoices Statement'
): void {
  const printWindow = window.open('', '_blank', 'width=1100,height=800');
  if (!printWindow) return;

  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const paidAmount = invoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + (i.amount || 0), 0);
  const overdueAmount = invoices.filter((i) => i.status === 'Overdue').reduce((sum, i) => sum + (i.amount || 0), 0);

  const rowsHtml = invoices
    .map(
      (inv, idx) => `
    <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: 600;">${inv.id}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-weight: 500;">${inv.tenant}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; color: #64748b; text-align: center;">${inv.date}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 700; color: #059669;">₹${inv.amount.toLocaleString('en-IN')}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: center;"><span style="display:inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; background: ${inv.status === 'Paid' ? '#dcfce7; color: #15803d;' : '#ffe4e6; color: #e11d48;'}">${inv.status}</span></td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #475569;">${inv.method}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 11px; color: #64748b;">${inv.gst}</td>
    </tr>`
    )
    .join('');

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${title} - Smart Library SaaS</title>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 24px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 20px; }
        .title { font-size: 22px; font-weight: 700; color: #1e1b4b; margin: 0; }
        .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
        .kpis { display: flex; gap: 16px; margin-bottom: 20px; }
        .kpi { flex: 1; padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; }
        .kpi-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; }
        .kpi-val { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #1e1b4b; color: #ffffff; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">${title}</h1>
          <p class="subtitle">Smart Library SaaS SuperAdmin Console • Generated: ${new Date().toLocaleString('en-IN')}</p>
        </div>
        <div class="no-print">
          <button onclick="window.print()" style="background:#4f46e5;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:600;cursor:pointer;">Print Invoices</button>
        </div>
      </div>
      <div class="kpis">
        <div class="kpi"><div class="kpi-label">Total Invoices</div><div class="kpi-val">${invoices.length}</div></div>
        <div class="kpi"><div class="kpi-label">Total Invoiced Amount</div><div class="kpi-val">₹${totalAmount.toLocaleString('en-IN')}</div></div>
        <div class="kpi"><div class="kpi-label">Collected Payments</div><div class="kpi-val" style="color:#059669;">₹${paidAmount.toLocaleString('en-IN')}</div></div>
        <div class="kpi"><div class="kpi-label">Overdue Balance</div><div class="kpi-val" style="color:#e11d48;">₹${overdueAmount.toLocaleString('en-IN')}</div></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Tenant</th>
            <th style="text-align: center;">Date</th>
            <th style="text-align: right;">Amount</th>
            <th style="text-align: center;">Status</th>
            <th style="text-align: center;">Method</th>
            <th>GSTIN</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </body>
  </html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 500);
}
