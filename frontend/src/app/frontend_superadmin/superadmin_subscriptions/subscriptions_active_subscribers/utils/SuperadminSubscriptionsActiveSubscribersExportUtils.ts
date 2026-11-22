'use client';

import type { SuperadminSubscriptionRecord } from '../types/SuperadminSubscriptionsActiveSubscribersTypes';

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Downloads subscriber records as CSV.
 */
export function downloadSuperadminSubscriptionsCsv(
  subscribers: SuperadminSubscriptionRecord[],
  filename = 'superadmin_subscriptions_export.csv'
): void {
  const headers = ['Subscription ID', 'Tenant / Library', 'Plan', 'Billing Cycle', 'MRR (INR)', 'Payment Status', 'Contact Person', 'Phone', 'Email'];
  const rows = subscribers.map((sub) => [
    escapeCsv(sub.id),
    escapeCsv(sub.tenant),
    escapeCsv(sub.plan),
    escapeCsv(sub.cycle),
    escapeCsv(sub.mrr),
    escapeCsv(sub.status),
    escapeCsv((sub as any).billingContact || 'Primary Admin'),
    escapeCsv((sub as any).phone || 'N/A'),
    escapeCsv((sub as any).email || 'N/A'),
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
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
 * Downloads subscriber records as Excel (.xls).
 */
export function downloadSuperadminSubscriptionsExcel(
  subscribers: SuperadminSubscriptionRecord[],
  filename = 'superadmin_subscriptions_export.xls'
): void {
  const tableRows = subscribers
    .map((sub, idx) => {
      const statusColor = sub.status === 'Paid' ? '#059669' : sub.status === 'Due Soon' ? '#d97706' : '#e11d48';
      return `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">${sub.tenant}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${sub.plan}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${sub.cycle}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold;">₹${sub.mrr?.toLocaleString('en-IN') ?? 0}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: ${statusColor}; font-weight: bold;">${sub.status}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">${(sub as any).billingContact || 'Primary Admin'}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">${(sub as any).phone || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">${(sub as any).email || 'N/A'}</td>
      </tr>`;
    })
    .join('');

  const html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Active Subscribers</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
      table { border-collapse: collapse; width: 100%; }
      th { background-color: #4f46e5; color: #ffffff; padding: 10px; font-weight: bold; border: 1px solid #4338ca; text-align: left; }
    </style>
  </head>
  <body>
    <h2>Smart Library SaaS - Active Subscribers Roster</h2>
    <p>Export Date: ${new Date().toLocaleString('en-IN')} | Total Subscribers: ${subscribers.length}</p>
    <table>
      <thead>
        <tr>
          <th>Tenant / Library</th>
          <th>Plan</th>
          <th>Cycle</th>
          <th>MRR Contribution</th>
          <th>Status</th>
          <th>Billing Contact</th>
          <th>Phone</th>
          <th>Email</th>
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
 * Prints subscriber roster.
 */
export function printSuperadminSubscriptionsRoster(
  subscribers: SuperadminSubscriptionRecord[],
  title = 'Active Subscribers Directory'
): void {
  const printWindow = window.open('', '_blank', 'width=1100,height=800');
  if (!printWindow) return;

  const totalMrr = subscribers.reduce((acc, r) => acc + (typeof r.mrr === 'number' ? r.mrr : 0), 0);
  const paidCount = subscribers.filter((r) => r.status === 'Paid').length;

  const rowsHtml = subscribers
    .map(
      (sub, idx) => `
    <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; page-break-inside: avoid;">
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; font-weight: 700; font-size: 10px;">${sub.tenant}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9px;"><span style="display:inline-block; padding: 1px 6px; border-radius: 9999px; font-weight: 700; background: #e0e7ff; color: #3730a3;">${sub.plan}</span></td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; color: #64748b; font-size: 9.5px;">${sub.cycle}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: right; font-weight: 700; font-size: 10px; color: #059669;">₹${sub.mrr?.toLocaleString('en-IN') ?? 0}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9px;"><span style="display:inline-block; padding: 1px 6px; border-radius: 9999px; font-weight: 700; background: ${sub.status === 'Paid' ? '#dcfce7; color: #15803d;' : sub.status === 'Due Soon' ? '#fef3c7; color: #b45309;' : '#ffe4e6; color: #e11d48;'}">${sub.status}</span></td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; font-size: 9.5px; color: #334155;">${(sub as any).billingContact || 'Primary Admin'}<br/><span style="color:#0284c7;font-weight:600;">${(sub as any).phone || ''}</span></td>
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
          <button onclick="window.print()" style="background:#4f46e5;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Print Roster</button>
          <button onclick="window.close()" style="background:#f1f5f9;color:#475569;border:1px solid #cbd5e1;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">Close</button>
        </div>
      </div>
      <div class="kpis">
        <div class="kpi"><span class="kpi-label">Active Subscribers:</span><span class="kpi-val">${subscribers.length}</span></div>
        <div class="kpi"><span class="kpi-label">Total MRR:</span><span class="kpi-val" style="color:#059669;">₹${totalMrr.toLocaleString('en-IN')}</span></div>
        <div class="kpi"><span class="kpi-label">Paid Ratio:</span><span class="kpi-val">${Math.round((paidCount / Math.max(1, subscribers.length)) * 100)}%</span></div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 25%;">Tenant / Library</th>
            <th style="width: 12%; text-align: center;">Plan</th>
            <th style="width: 12%; text-align: center;">Cycle</th>
            <th style="width: 16%; text-align: right;">MRR Contribution</th>
            <th style="width: 14%; text-align: center;">Payment Status</th>
            <th style="width: 21%;">Contact Details</th>
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
