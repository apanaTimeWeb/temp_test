import type { AdminPlansPlan } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import { toast } from 'sonner';

/** Formats prices only when the source record explicitly declares currency and unit. */
export function formatAdminPlansPrice(
  amount: number,
  currencyCode: string | undefined,
  amountUnit: 'minor' | 'major' | undefined,
  locale: string,
): string {
  if (!currencyCode || !/^[A-Z]{3}$/.test(currencyCode) || amountUnit === undefined || !Number.isFinite(amount) || amount < 0) return '—';
  const resolvedLocale = locale === 'hi' ? 'hi-IN' : locale === 'en' ? 'en-IN' : locale;
  const formatter = new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency: currencyCode });
  const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  if (amountUnit === 'minor' && !Number.isSafeInteger(amount)) return '—';
  const major = amountUnit === 'minor' ? amount / (10 ** fractionDigits) : amount;
  return formatter.format(major);
}

/** Performs an immutable insert-or-replace in page-local demo state. */
export function upsertAdminPlansDemoPlan(plans: readonly AdminPlansPlan[], nextPlan: AdminPlansPlan): AdminPlansPlan[] {
  const exists = plans.some((plan) => plan.id === nextPlan.id);
  return exists ? plans.map((plan) => (plan.id === nextPlan.id ? nextPlan : plan)) : [nextPlan, ...plans];
}

/** Removes only the requested plan from page-local demo state. */
export function removeAdminPlansDemoPlan(plans: readonly AdminPlansPlan[], planId: string): AdminPlansPlan[] {
  return plans.filter((plan) => plan.id !== planId);
}

function escapeHtml(text: string): string {
  return text.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function exportPlansCsv(visiblePlans: readonly AdminPlansPlan[]): void {
  const headers = ['Plan ID', 'Name', 'Price', 'Currency', 'Duration', 'Duration Days', 'Status', 'Subscribers', 'Branch', 'Features'];
  const rows = visiblePlans.map((p) => [
    `"${p.id}"`,
    `"${p.name.replaceAll('"', '""')}"`,
    p.price,
    p.currencyCode || 'INR',
    `"${p.duration}"`,
    p.durationDays,
    `"${p.status}"`,
    p.subscribers,
    `"${(p.branchApplicability || 'All Branches').replaceAll('"', '""')}"`,
    `"${p.features.join('; ').replaceAll('"', '""')}"`,
  ]);
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'smart-library-plans.csv';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${visiblePlans.length} plans to CSV`, { id: 'admin-plans-export-csv' });
}

export function exportPlansExcel(visiblePlans: readonly AdminPlansPlan[]): void {
  const headers = ['Plan ID', 'Plan Name', 'Price (INR)', 'Duration', 'Days', 'Status', 'Subscribers', 'Branch', 'Features'];
  const rows = visiblePlans.map((p) => [
    p.id,
    p.name,
    p.price,
    p.duration,
    p.durationDays,
    p.status,
    p.subscribers,
    p.branchApplicability || 'All Branches',
    p.features.join(' | '),
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #1e1b4b; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #312e81; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #f8fafc; }
      </style>
    </head>
    <body>
      <table>
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(String(cell ?? ''))}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `.trim();
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'smart-library-plans.xls';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${visiblePlans.length} plans to Excel (.xls)`, { id: 'admin-plans-export-excel' });
}

export function printPlansCatalogHtml(visiblePlans: readonly AdminPlansPlan[], branchName: string | undefined): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Smart Library - Fee Structure & Plans Catalog</title>
        <style>
          @page { size: landscape; margin: 10mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; }
          .title { font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
          .meta { font-size: 11px; text-align: right; color: #475569; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 6px; border: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 10px; }
          td { padding: 6px; border: 1px solid #e2e8f0; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
          .badge-active { background: #dcfce7; color: #15803d; }
          .badge-inactive { background: #fee2e2; color: #b91c1c; }
          .footer { margin-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">Smart Library Network · Membership Plans & Pricing Catalog</div>
            <div class="subtitle">Scope: ${escapeHtml(branchName || 'All Branches')} · Total Plans: ${visiblePlans.length}</div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Confidential:</strong> Admin Authorized View</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Plan Name</th><th>Price</th><th>Duration</th><th>Subscribers</th><th>Branch</th><th>Status</th><th>Key Features</th>
            </tr>
          </thead>
          <tbody>
            ${visiblePlans.map((p) => `
              <tr>
                <td><strong>${escapeHtml(p.name)}</strong></td>
                <td>₹${p.price.toLocaleString('en-IN')}</td>
                <td>${escapeHtml(p.duration)} (${p.durationDays} days)</td>
                <td>${p.subscribers} members</td>
                <td>${escapeHtml(p.branchApplicability || 'All Branches')}</td>
                <td><span class="badge badge-${p.status.toLowerCase()}">${escapeHtml(p.status)}</span></td>
                <td>${escapeHtml(p.features.join('; '))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <span>Smart Library Plans Catalog</span>
          <span>Page 1 of 1</span>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
