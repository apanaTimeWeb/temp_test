'use client';
// RESPONSIBILITY: Export utilities (CSV, Excel, Print) for SaaS Subscriptions Overview (< 120 lines).
import type { SuperadminSubscriptionRecord } from '../types/SuperadminSubscriptionsOverviewTypes';

/**
 * Downloads subscriptions as standard CSV with UTF-8 BOM.
 */
export function downloadSuperadminSubscriptionsCsv(
  subs: SuperadminSubscriptionRecord[],
  filename = 'superadmin_subscriptions_roster.csv'
): void {
  const headers = ['ID', 'Tenant', 'Plan', 'Cycle', 'MRR (INR)', 'Status', 'Renewal Date', 'Auto Renewal', 'Branches', 'Email', 'Phone'];
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

  const rows = subs.map((s) => [
    esc(s.id),
    esc(s.tenant),
    esc(s.plan),
    esc(s.cycle),
    s.mrr,
    esc(s.status),
    esc(s.renewalDate || 'N/A'),
    s.autoRenewal ? 'Yes' : 'No',
    s.branchesCount ?? 1,
    esc(s.email || ''),
    esc(s.phone || ''),
  ].join(','));

  const csv = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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
 * Downloads subscriptions as Excel (.xls) spreadsheet.
 */
export function downloadSuperadminSubscriptionsExcel(
  subs: SuperadminSubscriptionRecord[],
  filename = 'superadmin_subscriptions_roster.xls'
): void {
  const tableRows = subs.map((s, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
      <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold;">${s.tenant}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${s.plan}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${s.cycle}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold;">₹${s.mrr.toLocaleString('en-IN')}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${s.status}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${s.renewalDate || 'N/A'}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${s.branchesCount ?? 1}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${s.email || s.phone || 'N/A'}</td>
    </tr>
  `).join('');

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>body { font-family: Calibri, Arial, sans-serif; } table { border-collapse: collapse; width: 100%; } th { background-color: #4f46e5; color: white; padding: 10px; text-align: left; }</style>
    </head>
    <body>
      <h2>Smart Library SaaS - Subscriptions & Tenants Roster</h2>
      <p>Export Date: ${new Date().toLocaleString('en-IN')} | Total: ${subs.length}</p>
      <table>
        <thead><tr><th>Tenant</th><th>Plan</th><th>Cycle</th><th>MRR (INR)</th><th>Status</th><th>Renewal Date</th><th>Branches</th><th>Contact</th></tr></thead>
        <tbody>${tableRows}</tbody>
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

// Re-export print utility from dedicated submodule to respect line limits
export { printSuperadminSubscriptionsRoster } from './SuperadminSubscriptionsOverviewPrintUtils';
