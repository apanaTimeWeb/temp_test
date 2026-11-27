import type { AdminPlansPlan } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import { escapePlanHtml } from '@/app/frontend_admin/admin_members/members_plans/utils/adminMembersPlansSpreadsheet';

const PLANS_PRINT_CSS = `
  @page { size: landscape; margin: 10mm; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; }
  .title { font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
  .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; } .meta { font-size: 11px; text-align: right; color: #475569; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 6px; border: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 10px; }
  td { padding: 6px; border: 1px solid #e2e8f0; } tr:nth-child(even) { background-color: #f8fafc; }
  .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
  .badge-active { background: #dcfce7; color: #15803d; } .badge-inactive { background: #fee2e2; color: #b91c1c; }
  .footer { margin-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; }
`;

export function printPlansCatalogHtml(visiblePlans: readonly AdminPlansPlan[], branchName: string | undefined): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const html = `
    <!DOCTYPE html><html><head><title>Smart Library - Fee Structure & Plans Catalog</title><style>${PLANS_PRINT_CSS}</style></head>
      <body>
        <div class="header">
          <div><div class="title">Smart Library Network · Membership Plans & Pricing Catalog</div><div class="subtitle">Scope: ${escapePlanHtml(branchName || 'All Branches')} · Total Plans: ${visiblePlans.length}</div></div>
          <div class="meta"><div><strong>Generated:</strong> ${dateStr}</div><div><strong>Confidential:</strong> Admin Authorized View</div></div>
        </div>
        <table>
          <thead><tr><th>Plan Name</th><th>Price</th><th>Duration</th><th>Subscribers</th><th>Branch</th><th>Status</th><th>Key Features</th></tr></thead>
          <tbody>
            ${visiblePlans.map((p) => `
              <tr>
                <td><strong>${escapePlanHtml(p.name)}</strong></td>
                <td>₹${p.price.toLocaleString('en-IN')}</td>
                <td>${escapePlanHtml(p.duration)} (${p.durationDays} days)</td>
                <td>${p.subscribers} members</td>
                <td>${escapePlanHtml(p.branchApplicability || 'All Branches')}</td>
                <td><span class="badge badge-${p.status.toLowerCase()}">${escapePlanHtml(p.status)}</span></td>
                <td>${escapePlanHtml(p.features.join('; '))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer"><span>Smart Library Plans Catalog</span><span>Page 1 of 1</span></div>
        <script>window.onload = function() { window.print(); };</script>
      </body></html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
