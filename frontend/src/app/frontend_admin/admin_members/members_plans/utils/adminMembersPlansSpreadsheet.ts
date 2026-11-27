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

export function escapePlanHtml(text: string): string {
  return text.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export function exportPlansCsv(visiblePlans: readonly AdminPlansPlan[]): void {
  const headers = ['Plan ID', 'Name', 'Price', 'Currency', 'Duration', 'Duration Days', 'Status', 'Subscribers', 'Branch', 'Features'];
  const rows = visiblePlans.map((p) => [
    `"${p.id}"`, `"${p.name.replaceAll('"', '""')}"`, p.price, p.currencyCode || 'INR',
    `"${p.duration}"`, p.durationDays, `"${p.status}"`, p.subscribers,
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
    p.id, p.name, p.price, p.duration, p.durationDays, p.status, p.subscribers,
    p.branchApplicability || 'All Branches', p.features.join(' | '),
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #1e1b4b; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #312e81; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #f8fafc; }
      </style>
    </head>
    <body><table>
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapePlanHtml(String(cell ?? ''))}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></body></html>
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
