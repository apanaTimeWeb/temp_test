'use client';

import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';

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
    <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; page-break-inside: avoid;">
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; font-family: monospace; font-weight: 700; font-size: 10px;">${inv.id}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; font-weight: 600; font-size: 10px;">${inv.tenant}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; color: #64748b; text-align: center; font-size: 9.5px;">${inv.date}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: right; font-weight: 700; color: #059669; font-size: 10px;">₹${inv.amount.toLocaleString('en-IN')}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9px;"><span style="display:inline-block; padding: 1px 6px; border-radius: 9999px; font-weight: 700; background: ${inv.status === 'Paid' ? '#dcfce7; color: #15803d;' : '#ffe4e6; color: #e11d48;'}">${inv.status}</span></td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; color: #475569; font-size: 9.5px;">${inv.method}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; font-family: monospace; font-size: 9.5px; color: #64748b;">${inv.gst}</td>
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
        @page { size: landscape; margin: 8mm 6mm; }
        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 10px; line-height: 1.3; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4f46e5; padding-bottom: 8px; margin-bottom: 10px; }
        .title { font-size: 18px; font-weight: 800; color: #1e1b4b; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .subtitle { font-size: 10px; color: #64748b; margin-top: 2px; }
        .kpis { display: flex; gap: 10px; margin-bottom: 10px; }
        .kpi { flex: 1; padding: 6px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
        .kpi-label { font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 700; }
        .kpi-val { font-size: 14px; font-weight: 800; color: #0f172a; }
        table { width: 100%; border-collapse: collapse; font-size: 10px; table-layout: fixed; }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; }
        th { background: #1e1b4b; color: #ffffff; text-align: left; padding: 6px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid #312e81; }
        @media print {
          body { padding: 0; }
          .no-print { display: none !important; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 class="title">${title}</h1>
          <p class="subtitle">Smart Library SaaS SuperAdmin Console • Generated: ${new Date().toLocaleString('en-IN')}</p>
        </div>
        <div class="no-print" style="display:flex;gap:8px;">
          <button onclick="window.print()" style="background:#4f46e5;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Print Statement</button>
          <button onclick="window.close()" style="background:#f1f5f9;color:#475569;border:1px solid #cbd5e1;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">Close</button>
        </div>
      </div>
      <div class="kpis">
        <div class="kpi"><span class="kpi-label">Total Invoices:</span><span class="kpi-val">${invoices.length}</span></div>
        <div class="kpi"><span class="kpi-label">Total Amount:</span><span class="kpi-val">₹${totalAmount.toLocaleString('en-IN')}</span></div>
        <div class="kpi"><span class="kpi-label">Paid Realized:</span><span class="kpi-val" style="color:#059669;">₹${paidAmount.toLocaleString('en-IN')}</span></div>
        <div class="kpi"><span class="kpi-label">Overdue Outstanding:</span><span class="kpi-val" style="color:#e11d48;">₹${overdueAmount.toLocaleString('en-IN')}</span></div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 15%;">Invoice ID</th>
            <th style="width: 25%;">Tenant / Library</th>
            <th style="width: 12%; text-align: center;">Date</th>
            <th style="width: 15%; text-align: right;">Amount</th>
            <th style="width: 12%; text-align: center;">Status</th>
            <th style="width: 11%; text-align: center;">Method</th>
            <th style="width: 10%;">GSTIN</th>
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
