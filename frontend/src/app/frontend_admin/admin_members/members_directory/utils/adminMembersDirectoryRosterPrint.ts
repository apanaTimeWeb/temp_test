import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const ROSTER_PRINT_CSS = `
  @page { size: landscape; margin: 10mm; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; }
  .title { font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
  .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; } .meta { font-size: 11px; text-align: right; color: #475569; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 6px; border: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 10px; }
  td { padding: 6px; border: 1px solid #e2e8f0; } tr:nth-child(even) { background-color: #f8fafc; }
  .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
  .badge-active { background: #dcfce7; color: #15803d; } .badge-expired { background: #ffe4e6; color: #be123c; }
  .badge-suspended { background: #fef3c7; color: #b45309; } .badge-blocked { background: #fee2e2; color: #b91c1c; }
  .footer { margin-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; }
`;

/** Prints a clean, high-resolution roster view with letterhead. */
export function printAdminMembersRoster(members: readonly AdminMembersMember[], branchName = 'All Branches'): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
  if (!printWindow) {
    window.print();
    return;
  }
  printWindow.opener = null;
  const dateStr = escapeHtml(new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }));
  const html = `
    <!DOCTYPE html><html><head><title>Smart Library - Member Directory Roster</title><style>${ROSTER_PRINT_CSS}</style></head>
      <body>
        <div class="header">
          <div><div class="title">Smart Library Network · Member Roster</div><div class="subtitle">Scope: ${escapeHtml(branchName)} · Total Records: ${members.length}</div></div>
          <div class="meta"><div><strong>Generated:</strong> ${dateStr}</div><div><strong>Confidential:</strong> Admin Authorized View</div></div>
        </div>
        <table>
          <thead><tr><th>ID</th><th>Full Name</th><th>Contact</th><th>Branch</th><th>Plan</th><th>Seat / Shift</th><th>Fee</th><th>Expiry</th><th>Status</th></tr></thead>
          <tbody>
            ${members.map((m) => `
              <tr>
                <td style="font-family: monospace; font-weight: 600;">${escapeHtml(m.id)}</td>
                <td><strong>${escapeHtml(m.name)}</strong></td>
                <td>${escapeHtml(m.phone || '—')}<br/><span style="color:#64748b; font-size:10px;">${escapeHtml(m.email || '—')}</span></td>
                <td>${escapeHtml(m.branch || 'Downtown Central')}</td>
                <td>${escapeHtml(m.plan)}</td>
                <td>${m.seat ? `Seat ${escapeHtml(m.seat)}` : '—'} · ${escapeHtml(m.shift || 'General')}</td>
                <td>${escapeHtml(m.feeStatus || 'Paid')}${m.dueFeeMinor ? ` (Due ₹${(m.dueFeeMinor / 100).toFixed(0)})` : ''}</td>
                <td>${escapeHtml(m.expiryDate || '—')}</td>
                <td><span class="badge badge-${escapeHtml((m.status || 'Active').toLowerCase())}">${escapeHtml(m.status)}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer"><span>Smart Library Administration System</span><span>Page 1 of 1</span></div>
        <script>window.onload = function() { window.print(); };</script>
      </body></html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
