'use client';

import type { SuperadminSupportTicket } from '../types/SuperadminSupportTicketsOverviewTypes';

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
    <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; page-break-inside: avoid;">
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; font-family: monospace; font-weight: 700; font-size: 10px;">${tkt.id}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; font-weight: 600; font-size: 10px; word-break: break-word;">${tkt.subject}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; font-size: 10px;">${tkt.tenant}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9px;"><span style="display:inline-block; padding: 1px 5px; border-radius: 4px; background: #f1f5f9; color: #334155;">${tkt.category}</span></td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9px;"><span style="display:inline-block; padding: 1px 6px; border-radius: 9999px; font-weight: 700; background: ${tkt.priority === 'High' || tkt.priority === 'Urgent' ? '#ffe4e6; color: #be123c;' : tkt.priority === 'Medium' ? '#fef3c7; color: #b45309;' : '#e2e8f0; color: #475569;'}">${tkt.priority}</span></td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9px;"><span style="display:inline-block; padding: 1px 6px; border-radius: 9999px; font-weight: 700; background: ${tkt.status === 'Resolved' ? '#dcfce7; color: #15803d;' : tkt.status === 'Open' ? '#ffe4e6; color: #be123c;' : '#fef3c7; color: #b45309;'}">${tkt.status}</span></td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; font-size: 10px; color: #334155;">${tkt.assignee}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; color: #64748b; font-size: 9px;">${tkt.age}</td>
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
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e11d48; padding-bottom: 8px; margin-bottom: 10px; }
        .title { font-size: 18px; font-weight: 800; color: #881337; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .subtitle { font-size: 10px; color: #64748b; margin-top: 2px; }
        .kpis { display: flex; gap: 12px; margin-bottom: 10px; }
        .kpi { flex: 1; padding: 6px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
        .kpi-label { font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 700; }
        .kpi-val { font-size: 14px; font-weight: 800; color: #0f172a; }
        table { width: 100%; border-collapse: collapse; font-size: 10px; table-layout: fixed; }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; }
        th { background: #881337; color: #ffffff; text-align: left; padding: 6px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid #700d2b; }
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
          <button onclick="window.print()" style="background:#e11d48;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">Print Roster</button>
          <button onclick="window.close()" style="background:#f1f5f9;color:#475569;border:1px solid #cbd5e1;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;">Close</button>
        </div>
      </div>
      <div class="kpis">
        <div class="kpi"><span class="kpi-label">Total Tickets:</span><span class="kpi-val">${tickets.length}</span></div>
        <div class="kpi"><span class="kpi-label">Open Tickets:</span><span class="kpi-val" style="color:#e11d48;">${openCount}</span></div>
        <div class="kpi"><span class="kpi-label">SLA Breaches:</span><span class="kpi-val" style="color:#e11d48;">${breaches}</span></div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 11%;">Ticket ID</th>
            <th style="width: 29%;">Subject</th>
            <th style="width: 17%;">Tenant</th>
            <th style="width: 13%; text-align: center;">Category</th>
            <th style="width: 8%; text-align: center;">Priority</th>
            <th style="width: 8%; text-align: center;">Status</th>
            <th style="width: 9%;">Assignee</th>
            <th style="width: 5%; text-align: center;">Age</th>
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
