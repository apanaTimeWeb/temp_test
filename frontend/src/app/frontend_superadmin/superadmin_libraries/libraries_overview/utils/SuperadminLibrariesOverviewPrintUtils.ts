'use client';

import type { SuperadminLibrariesLibrary } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';

/**
 * Opens a print-formatted window to print the libraries roster.
 */
export function printSuperadminLibrariesRoster(
  libraries: SuperadminLibrariesLibrary[],
  title = 'Registered Facilities Directory'
): void {
  const printWindow = window.open('', '_blank', 'width=1100,height=800');
  if (!printWindow) return;

  const totalRev = libraries.reduce((sum, l) => sum + (l.revenue || 0), 0);
  const totalStudents = libraries.reduce((sum, l) => sum + (l.students || 0), 0);
  const totalBranches = libraries.reduce((sum, l) => sum + (l.branches || 0), 0);

  const rowsHtml = libraries
    .map(
      (lib, idx) => `
    <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; page-break-inside: avoid;">
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; font-weight: 700; font-size: 10px;">${lib.name}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; color: #475569; font-size: 9.5px;">${lib.location}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px;">${lib.branches}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: right; font-size: 10px; font-weight: 600;">${lib.students?.toLocaleString() ?? 0}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9px;"><span style="display:inline-block; padding: 1px 6px; border-radius: 9999px; font-weight: 700; background: #e0e7ff; color: #3730a3;">${lib.plan}</span></td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9px;"><span style="display:inline-block; padding: 1px 6px; border-radius: 9999px; font-weight: 700; background: ${lib.status === 'Active' ? '#dcfce7; color: #15803d;' : '#fef3c7; color: #b45309;'}">${lib.status}</span></td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: right; font-weight: 700; font-size: 10px; color: #059669;">₹${lib.revenue?.toLocaleString('en-IN') ?? 0}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; font-size: 9.5px;">${lib.owner}</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; font-size: 9px; color: #475569; word-break: break-all;">${lib.email}<br/><span style="color:#0284c7;font-weight:600;">${lib.phone || ''}</span></td>
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
        <div class="kpi"><span class="kpi-label">Facilities:</span><span class="kpi-val">${libraries.length}</span></div>
        <div class="kpi"><span class="kpi-label">Branches:</span><span class="kpi-val">${totalBranches}</span></div>
        <div class="kpi"><span class="kpi-label">Students:</span><span class="kpi-val">${totalStudents.toLocaleString()}</span></div>
        <div class="kpi"><span class="kpi-label">LTV Revenue:</span><span class="kpi-val" style="color:#059669;">₹${totalRev.toLocaleString('en-IN')}</span></div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 17%;">Library Name</th>
            <th style="width: 13%;">Location</th>
            <th style="width: 7%; text-align: center;">Branches</th>
            <th style="width: 8%; text-align: right;">Students</th>
            <th style="width: 8%; text-align: center;">Plan</th>
            <th style="width: 8%; text-align: center;">Status</th>
            <th style="width: 11%; text-align: right;">LTV Revenue</th>
            <th style="width: 12%;">Owner</th>
            <th style="width: 16%;">Contact Details</th>
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
