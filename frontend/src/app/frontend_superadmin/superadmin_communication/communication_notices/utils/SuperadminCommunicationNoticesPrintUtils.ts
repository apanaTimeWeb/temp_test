import type { SuperadminCommunicationNotice as Notice } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/types/SuperadminCommunicationNoticesTypes';

/** Prints notices broadcast roster in 1 landscape page without overflow. */
export function printSuperadminNoticesRoster(notices: readonly Notice[], title = 'SuperAdmin Notices & Broadcast Roster'): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=1000,height=700');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const activeCount = notices.filter((n) => n.status === 'Active').length;
  const expiredCount = notices.length - activeCount;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: landscape; margin: 8mm 6mm; }
          * { box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 8.5pt; line-height: 1.25; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 8px; }
          .title { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0284c7; }
          .subtitle { font-size: 9.5px; color: #64748b; margin-top: 2px; }
          .meta { font-size: 8.5px; text-align: right; color: #475569; }
          .kpi-strip { display: flex; gap: 8px; margin-bottom: 8px; }
          .kpi-chip { flex: 1; padding: 4px 8px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 4px; font-size: 8.5px; }
          .kpi-chip strong { font-size: 10.5px; color: #0284c7; display: block; }
          table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
          th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 4px 5px; border: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 7.5pt; }
          td { padding: 4px 5px; border: 1px solid #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          tr { page-break-inside: avoid; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { display: inline-block; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700; text-transform: uppercase; }
          .badge-active { background: #dcfce7; color: #15803d; }
          .badge-expired { background: #fee2e2; color: #b91c1c; }
          .footer { margin-top: 10px; font-size: 8px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${title}</div>
            <div class="subtitle">Platform Announcements & Operational Broadcasts · SuperAdmin Governance</div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Classification:</strong> Official SuperAdmin Broadcast Export</div>
          </div>
        </div>
        <div class="kpi-strip">
          <div class="kpi-chip"><span>Total Broadcasts</span><strong>${notices.length}</strong></div>
          <div class="kpi-chip"><span>Active Notices</span><strong>${activeCount}</strong></div>
          <div class="kpi-chip"><span>Archived / Expired</span><strong>${expiredCount}</strong></div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 22%;">Notice Title</th>
              <th style="width: 38%;">Broadcast Message</th>
              <th style="width: 10%;">Status</th>
              <th style="width: 14%;">Valid Till</th>
              <th style="width: 16%;">Posted By</th>
            </tr>
          </thead>
          <tbody>
            ${notices.map((n) => `
              <tr>
                <td><strong>${n.title}</strong></td>
                <td>${n.message}</td>
                <td><span class="badge ${n.status === 'Active' ? 'badge-active' : 'badge-expired'}">${n.status}</span></td>
                <td>${n.validTill}</td>
                <td>${n.postedBy || 'SuperAdmin'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <span>Smart Library SaaS System · SuperAdmin Notices</span>
          <span>Confidential — Internal System Output</span>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `.trim();

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
