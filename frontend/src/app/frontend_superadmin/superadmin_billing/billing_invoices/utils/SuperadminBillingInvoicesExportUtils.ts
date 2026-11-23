'use client';

import type { SuperadminBillingInvoiceSample } from '../types/SuperadminBillingInvoicesTypes';
export { printSuperadminInvoicesRoster } from './SuperadminBillingInvoicesPrintUtils';

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
