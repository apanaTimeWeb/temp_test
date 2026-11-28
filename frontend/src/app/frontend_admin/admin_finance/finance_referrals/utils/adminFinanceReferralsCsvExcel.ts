import type { AdminFinanceDemoReferrer } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';
import { toast } from 'sonner';

function escapeReferralsCsvCell(value: unknown): string {
  const text = String(value ?? '');
  const isFiniteNumber = typeof value === 'number' && Number.isFinite(value);
  const safeText = !isFiniteNumber && /^[\u0000-\u0020]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

export function exportReferralsCsv(filteredReferrers: readonly AdminFinanceDemoReferrer[], fallbackBranchName: string) {
  const headers = ['Rank', 'Referrer Student', 'Smart ID', 'Branch', 'Referred Count', 'Referred Students', 'Total Bonus Earned (INR)', 'Redeemed (INR)', 'Outstanding Balance (INR)'];
  const rows = filteredReferrers.map((r, i) => [
    i + 1,
    r.name,
    r.smartId,
    r.branch ?? fallbackBranchName,
    r.referredNames.length,
    r.referredNames.join(', '),
    r.bonusEarned / 100,
    r.redeemed / 100,
    r.balance / 100,
  ].map(escapeReferralsCsvCell));
  const csv = [headers.map(escapeReferralsCsvCell).join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `admin-finance-referral-leaderboard-${new Date().toISOString().slice(0, 10)}.csv`;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${filteredReferrers.length} referral records to CSV`, { id: 'admin-finance-referrals-export-csv' });
}

export function exportReferralsExcel(filteredReferrers: readonly AdminFinanceDemoReferrer[], fallbackBranchName: string) {
  const headers = ['Rank', 'Referrer Student', 'Smart ID', 'Branch', 'Referred Count', 'Referred Students', 'Total Bonus Earned (INR)', 'Redeemed (INR)', 'Outstanding Balance (INR)'];
  const rows = filteredReferrers.map((r, i) => [
    i + 1,
    r.name,
    r.smartId,
    r.branch ?? fallbackBranchName,
    r.referredNames.length,
    r.referredNames.join(', '),
    r.bonusEarned / 100,
    r.redeemed / 100,
    r.balance / 100,
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #4338ca; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #3730a3; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #eef2ff; }
      </style>
    </head>
    <body><table>
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></body></html>
  `.trim();
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `admin-finance-referral-leaderboard-${new Date().toISOString().slice(0, 10)}.xls`;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${filteredReferrers.length} referral records to Excel (.xls)`, { id: 'admin-finance-referrals-export-excel' });
}
