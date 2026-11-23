'use client';

import type { SuperadminSupportTicket } from '../types/SuperadminSupportTicketsOverviewTypes';
export { printSuperadminSupportTicketsRoster } from './SuperadminSupportTicketsOverviewPrintUtils';

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
