import type { AdminStaffDirectoryManager } from '@/app/frontend_admin/admin_staff/staff_directory/schemas/AdminStaffDirectorySchema';

export interface ManagerAppointmentCreds {
  fullName: string;
  username: string;
  tempPassword: string;
  branchName: string;
  phone: string;
  email: string;
}

export function printManagerAppointmentLetter(creds: ManagerAppointmentCreds): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=800,height=650');
  if (!printWindow) return;
  printWindow.document.write(`
    <html>
      <head>
        <title>Appointment Letter - ${creds.fullName}</title>
        <style>
          body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:40px;color:#1e293b;line-height:1.5;}
          .header{border-bottom:2px solid #0f172a;padding-bottom:16px;margin-bottom:24px;}
          .header h1{margin:0;color:#0f172a;font-size:22px;}
          .header p{margin:4px 0 0;color:#64748b;font-size:13px;}
          .ref{font-weight:bold;font-family:monospace;color:#0284c7;margin-bottom:16px;}
          table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;}
          td{padding:6px 10px;border-bottom:1px solid #f1f5f9;}
          td:first-child{font-weight:600;color:#475569;width:180px;}
          .cred-box{background:#f8fafc;border:1px dashed #94a3b8;border-radius:8px;padding:14px;margin:16px 0;}
          .footer{margin-top:48px;border-top:1px solid #cbd5e1;padding-top:24px;display:flex;justify-content:space-between;font-size:12px;color:#64748b;}
          .sig-box{width:200px;text-align:center;}
          .sig-line{border-top:1px solid #334155;margin-top:48px;padding-top:4px;font-weight:bold;}
        </style>
      </head>
      <body>
        <div class="header"><h1>SMART LIBRARY MANAGEMENT NETWORK</h1><p>Official Branch Manager Appointment & Credential Letter</p></div>
        <div class="ref">REF: APPT-MGR-${Date.now().toString().slice(-6)}</div>
        <p>Dear <strong>${creds.fullName}</strong>,</p>
        <p>We are pleased to appoint you as the <strong>Branch Operations Manager</strong> for <strong>${creds.branchName}</strong>. You are authorized to manage daily student check-ins, cash counter handovers, seating rosters, and operational inquiries.</p>
        <div class="cred-box">
          <div style="font-weight:bold;margin-bottom:8px;color:#0f172a;">Your Official Login Credentials:</div>
          <table>
            <tr><td>Username:</td><td><strong>@${creds.username}</strong></td></tr>
            <tr><td>Temporary Password:</td><td><strong>${creds.tempPassword}</strong></td></tr>
            <tr><td>Assigned Branch:</td><td><strong>${creds.branchName}</strong></td></tr>
            <tr><td>Manager Portal URL:</td><td>https://smartlibrary.app/manager/login</td></tr>
          </table>
          <div style="font-size:11px;color:#64748b;">* Note: You will be prompted to set a new password on your initial login. Never share these credentials.</div>
        </div>
        <div class="footer"><div class="sig-box"><div class="sig-line">Employee Signature</div></div><div class="sig-box"><div class="sig-line">Master Admin Authorization</div></div></div>
        <script>window.onload=function(){window.print();};</script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

export function exportStaffDirectoryCsv(sortedManagers: readonly AdminStaffDirectoryManager[]): void {
  if (sortedManagers.length === 0) return;
  const headers = ['Staff ID', 'Name', 'Username', 'Role', 'Email', 'Phone', 'Branch', 'Status', 'Last Active'];
  const rows = sortedManagers.map((m) => [
    `"${m.id}"`, `"${m.name.replace(/"/g, '""')}"`, `"${m.username}"`, `"${m.role || 'Staff'}"`,
    `"${m.email}"`, `"${m.phone}"`, `"${m.branch}"`, `"${m.status}"`, `"${m.lastActive}"`,
  ]);
  const blob = new Blob(['\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `admin-staff-roster-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportStaffDirectoryExcel(sortedManagers: readonly AdminStaffDirectoryManager[]): void {
  if (sortedManagers.length === 0) return;
  const rows = sortedManagers
    .map((m) => `<tr><td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${m.id}</td><td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${m.name}</td><td style="padding:6px;border:1px solid #ccc;">@${m.username}</td><td style="padding:6px;border:1px solid #ccc;">${m.role || 'Staff'}</td><td style="padding:6px;border:1px solid #ccc;">${m.email}</td><td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${m.phone}</td><td style="padding:6px;border:1px solid #ccc;">${m.branch}</td><td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${m.status}</td><td style="padding:6px;border:1px solid #ccc;">${m.lastActive}</td></tr>`)
    .join('');
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><title>Staff Directory Roster</title></head><body><h2>Smart Library Network - Staff Directory Roster</h2><p>Generated: ${new Date().toLocaleString('en-IN')}</p><table border="1" style="border-collapse:collapse;font-family:sans-serif;font-size:12px;"><thead><tr style="background-color:#1e293b;color:#ffffff;font-weight:bold;text-align:left;"><th style="padding:8px;border:1px solid #ccc;">Staff ID</th><th style="padding:8px;border:1px solid #ccc;">Name</th><th style="padding:8px;border:1px solid #ccc;">Username</th><th style="padding:8px;border:1px solid #ccc;">Role</th><th style="padding:8px;border:1px solid #ccc;">Email</th><th style="padding:8px;border:1px solid #ccc;">Phone</th><th style="padding:8px;border:1px solid #ccc;">Branch</th><th style="padding:8px;border:1px solid #ccc;">Status</th><th style="padding:8px;border:1px solid #ccc;">Last Active</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `admin-staff-roster-${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function printStaffDirectoryRoster(sortedManagers: readonly AdminStaffDirectoryManager[]): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) { window.print(); return; }
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const html = `<!DOCTYPE html><html><head><title>Smart Library - Staff Directory Roster</title><style>@page{size:landscape;margin:10mm;}body{font-family:system-ui,-apple-system,sans-serif;color:#0f172a;margin:0;padding:15px;}.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0f172a;padding-bottom:8px;margin-bottom:12px;}table{width:100%;border-collapse:collapse;font-size:11px;}th{background:#f1f5f9;padding:6px;border:1px solid #cbd5e1;text-align:left;}td{padding:6px;border:1px solid #e2e8f0;}tr:nth-child(even){background:#f8fafc;}</style></head><body><div class="header"><div><h2 style="margin:0;">Smart Library Network · Staff Roster</h2><div style="font-size:12px;color:#64748b;">Total Staff Records: ${sortedManagers.length}</div></div><div style="font-size:11px;text-align:right;"><div>Date: ${dateStr}</div></div></div><table><thead><tr><th>ID</th><th>Staff Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Branch</th><th>Status</th></tr></thead><tbody>${sortedManagers.map((m) => `<tr><td><code>${m.id}</code></td><td><strong>${m.name}</strong> (@${m.username})</td><td>${m.role || 'Staff'}</td><td>${m.email}</td><td>${m.phone}</td><td>${m.branch}</td><td><strong>${m.status}</strong></td></tr>`).join('')}</tbody></table><script>window.onload=function(){window.print();};</script></body></html>`;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
