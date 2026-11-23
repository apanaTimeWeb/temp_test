'use client';

import type { SuperadminSubscriptionRecord } from '../types/SuperadminSubscriptionsOverviewTypes';

/**
 * Opens a print dialog for subscriptions roster.
 */
export function printSuperadminSubscriptionsRoster(
  subs: SuperadminSubscriptionRecord[],
  title = 'SaaS Subscriptions Roster'
): void {
  const printWindow = window.open('', '_blank', 'width=1100,height=800');
  if (!printWindow) return;

  const totalMrr = subs.reduce((sum, s) => sum + (s.mrr || 0), 0);
  const activeCount = subs.filter((s) => s.status === 'Active' || s.status === 'Paid').length;

  const rowsHtml = subs.map((s, idx) => `
    <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; page-break-inside: avoid;">
      <td style="padding: 6px; border: 1px solid #cbd5e1; font-weight: 700;">${s.tenant}</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">${s.plan}</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center;">${s.cycle}</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: right; font-weight: 700; color: #059669;">₹${s.mrr.toLocaleString('en-IN')}</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; font-weight: 700;">${s.status}</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center;">${s.renewalDate || 'N/A'}</td>
      <td style="padding: 6px; border: 1px solid #cbd5e1;">${s.email || s.phone || 'N/A'}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html><html><head><title>${title}</title><meta charset="utf-8"/><style>
      body { font-family: -apple-system, sans-serif; padding: 15px; font-size: 11px; }
      table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      th { background: #1e1b4b; color: white; padding: 8px; text-align: left; font-size: 10px; }
      .kpis { display: flex; gap: 15px; margin: 10px 0; }
      .kpi { padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
    </style></head><body>
      <h1>${title}</h1>
      <p>Generated: ${new Date().toLocaleString('en-IN')}</p>
      <div class="kpis">
        <div class="kpi"><strong>Total Tenants:</strong> ${subs.length}</div>
        <div class="kpi"><strong>Active Tenants:</strong> ${activeCount}</div>
        <div class="kpi"><strong>Total MRR:</strong> ₹${totalMrr.toLocaleString('en-IN')}</div>
      </div>
      <table><thead><tr><th>Tenant</th><th>Plan</th><th>Cycle</th><th>MRR</th><th>Status</th><th>Renewal Date</th><th>Contact</th></tr></thead><tbody>${rowsHtml}</tbody></table>
    </body></html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 500);
}
