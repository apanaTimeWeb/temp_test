'use client';

import type { SuperadminSupportTicket } from '../types/SuperadminSupportTicketsOverviewTypes';

/**
 * Downloads support tickets as an Excel (.xls) spreadsheet.
 */
export function downloadSuperadminSupportTicketsExcel(
  tickets: SuperadminSupportTicket[],
  filename = 'superadmin_support_tickets.xls'
): void {
  const tableRows = tickets
    .map((tkt, idx) => {
      const statusColor = tkt.status === 'Resolved' ? '#059669' : tkt.status === 'Open' ? '#e11d48' : '#d97706';
      const priorityColor = tkt.priority === 'High' ? '#e11d48' : tkt.priority === 'Medium' ? '#d97706' : '#64748b';
      return `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-family: monospace; font-weight: bold;">${tkt.id}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">${tkt.subject}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">${tkt.tenant}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${tkt.category}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: ${priorityColor}; font-weight: bold;">${tkt.priority}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; color: ${statusColor}; font-weight: bold;">${tkt.status}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">${tkt.assignee}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${tkt.slaBreach ? 'BREACHED' : 'OK'}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${tkt.age}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1;">${(tkt as any).phone || 'N/A'}</td>
      </tr>`;
    })
    .join('');

  const html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Support Helpdesk</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
      table { border-collapse: collapse; width: 100%; }
      th { background-color: #e11d48; color: #ffffff; padding: 10px; font-weight: bold; border: 1px solid #be123c; text-align: left; }
    </style>
  </head>
  <body>
    <h2>Smart Library SaaS - Helpdesk & Support Tickets</h2>
    <p>Export Date: ${new Date().toLocaleString('en-IN')} | Total Tickets: ${tickets.length}</p>
    <table>
      <thead>
        <tr>
          <th>Ticket ID</th>
          <th>Subject</th>
          <th>Tenant</th>
          <th>Category</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Assignee</th>
          <th>SLA Status</th>
          <th>Age</th>
          <th>Phone</th>
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
 * Prints support tickets roster.
 */
export function printSuperadminSupportTicketsRoster(
  tickets: SuperadminSupportTicket[],
  title = 'Helpdesk Tickets Roster'
): void {
  const printWindow = window.open('', '_blank', 'width=1100,height=800');
  if (!printWindow) return;

  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const breaches = tickets.filter((t) => t.slaBreach && t.status !== 'Resolved').length;

  const rowsHtml = tickets
    .map(
      (tkt, idx) => `
    <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-weight: 600;">${tkt.id}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-weight: 600;">${tkt.subject}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0;">${tkt.tenant}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: center;"><span style="display:inline-block; padding: 2px 6px; border-radius: 4px; font-size: 11px; background: #f1f5f9; color: #475569;">${tkt.category}</span></td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: center;"><span style="display:inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; background: ${tkt.priority === 'High' ? '#ffe4e6; color: #e11d48;' : tkt.priority === 'Medium' ? '#fef3c7; color: #b45309;' : '#e2e8f0; color: #475569;'}">${tkt.priority}</span></td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: center;"><span style="display:inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; background: ${tkt.status === 'Resolved' ? '#dcfce7; color: #15803d;' : tkt.status === 'Open' ? '#ffe4e6; color: #e11d48;' : '#fef3c7; color: #b45309;'}">${tkt.status}</span></td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #334155;">${tkt.assignee}</td>
      <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px;">${tkt.age}</td>
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
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e11d48; padding-bottom: 16px; margin-bottom: 20px; }
        .title { font-size: 22px; font-weight: 700; color: #881337; margin: 0; }
        .subtitle { font-size: 12px; color: #64748b; margin-top: 4px; }
        .kpis { display: flex; gap: 16px; margin-bottom: 20px; }
        .kpi { flex: 1; padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; }
        .kpi-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; }
        .kpi-val { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 2px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th { background: #881337; color: #ffffff; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
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
          <button onclick="window.print()" style="background:#e11d48;color:#fff;border:none;padding:8px 16px;border-radius:6px;font-weight:600;cursor:pointer;">Print Roster</button>
        </div>
      </div>
      <div class="kpis">
        <div class="kpi"><div class="kpi-label">Total Tickets</div><div class="kpi-val">${tickets.length}</div></div>
        <div class="kpi"><div class="kpi-label">Open Tickets</div><div class="kpi-val" style="color:#e11d48;">${openCount}</div></div>
        <div class="kpi"><div class="kpi-label">SLA Breaches</div><div class="kpi-val" style="color:#e11d48;">${breaches}</div></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Subject</th>
            <th>Tenant</th>
            <th style="text-align: center;">Category</th>
            <th style="text-align: center;">Priority</th>
            <th style="text-align: center;">Status</th>
            <th>Assignee</th>
            <th style="text-align: center;">Age</th>
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
