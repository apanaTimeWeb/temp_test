import type { SuperadminUserData } from '../types/SuperadminUsersDirectoryTypes';
import { maskSensitiveData } from './SuperadminUsersDirectoryMaskSensitiveData';

/** Prints user directory roster. */
export function printSuperadminUsersRoster(users: readonly SuperadminUserData[], title = 'SuperAdmin User Access Control Roster'): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=700');
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

  const activeCount = users.filter((u) => u.status === 'Active').length;
  const twoFaCount = users.filter((u) => u.twoFactor).length;
  const adminCount = users.filter((u) => u.role === 'SuperAdmin' || u.role === 'Admin').length;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: landscape; margin: 8mm 6mm; }
          * { box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 8.5pt; line-height: 1.25; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #312e81; padding-bottom: 8px; margin-bottom: 8px; }
          .title { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #312e81; }
          .subtitle { font-size: 9.5px; color: #64748b; margin-top: 2px; }
          .meta { font-size: 8.5px; text-align: right; color: #475569; }
          .kpi-strip { display: flex; gap: 8px; margin-bottom: 8px; }
          .kpi-chip { flex: 1; padding: 4px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 8.5px; }
          .kpi-chip strong { font-size: 10.5px; color: #312e81; display: block; }
          table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
          th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 4px 5px; border: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 7.5pt; }
          td { padding: 4px 5px; border: 1px solid #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          tr { page-break-inside: avoid; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { display: inline-block; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700; text-transform: uppercase; }
          .badge-superadmin { background: #f3e8ff; color: #7e22ce; }
          .badge-admin { background: #e0e7ff; color: #4338ca; }
          .badge-manager { background: #e0f2fe; color: #0369a1; }
          .badge-active { background: #dcfce7; color: #15803d; }
          .badge-suspended { background: #fef3c7; color: #b45309; }
          .footer { margin-top: 10px; font-size: 8px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${title}</div>
            <div class="subtitle">Platform Governance & Role-Based Access Control · SuperAdmin Registry</div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Classification:</strong> Confidential SuperAdmin Export</div>
          </div>
        </div>
        <div class="kpi-strip">
          <div class="kpi-chip"><span>Total Accounts</span><strong>${users.length}</strong></div>
          <div class="kpi-chip"><span>Active Users</span><strong>${activeCount}</strong></div>
          <div class="kpi-chip"><span>Privileged (Admin/SA)</span><strong>${adminCount}</strong></div>
          <div class="kpi-chip"><span>2FA Protected</span><strong>${twoFaCount} (${users.length ? Math.round((twoFaCount / users.length) * 100) : 0}%)</strong></div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 7%;">ID</th>
              <th style="width: 16%;">Full Name</th>
              <th style="width: 12%;">Username</th>
              <th style="width: 18%;">Email</th>
              <th style="width: 10%;">Role</th>
              <th style="width: 14%;">Branch / Tenant</th>
              <th style="width: 8%;">Status</th>
              <th style="width: 5%;">2FA</th>
              <th style="width: 10%;">Last Active</th>
            </tr>
          </thead>
          <tbody>
            ${users.map((u) => `
              <tr>
                <td>${u.id}</td>
                <td><strong>${u.name}</strong></td>
                <td>${u.username}</td>
                <td>${maskSensitiveData(u.email)}</td>
                <td><span class="badge ${u.role === 'SuperAdmin' ? 'badge-superadmin' : u.role === 'Admin' ? 'badge-admin' : 'badge-manager'}">${u.role}</span></td>
                <td>${u.branch}</td>
                <td><span class="badge ${u.status === 'Active' ? 'badge-active' : 'badge-suspended'}">${u.status}</span></td>
                <td>${u.twoFactor ? 'ON' : 'OFF'}</td>
                <td>${u.lastLogin || 'Never'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <span>Smart Library SaaS System · SuperAdmin Governance</span>
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
