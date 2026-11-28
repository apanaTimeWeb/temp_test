import { isValidAdminCouponsCalendarDate, type AdminCouponsCoupon } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import { format, parseISO } from 'date-fns';
import { enIN, hi } from 'date-fns/locale';
import { toast } from 'sonner';

export function formatAdminCouponsDiscount(
  coupon: Pick<AdminCouponsCoupon, 'discount' | 'type' | 'currencyCode' | 'amountUnit'>,
  locale: string,
  suffix: string,
): string {
  if (!Number.isFinite(coupon.discount) || coupon.discount < 0 || coupon.type === 'Unknown') return '—';
  if (coupon.type === 'Percent') return `${coupon.discount}% ${suffix}`;
  if (!coupon.currencyCode || !/^[A-Z]{3}$/.test(coupon.currencyCode) || !coupon.amountUnit) return '—';
  const resolvedLocale = locale === 'hi' ? 'hi-IN' : 'en-IN';
  const fractionDigits = new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency: coupon.currencyCode }).resolvedOptions().maximumFractionDigits ?? 2;
  if (coupon.amountUnit === 'minor' && !Number.isSafeInteger(coupon.discount)) return '—';
  const majorAmount = coupon.amountUnit === 'minor' ? coupon.discount / (10 ** fractionDigits) : coupon.discount;
  return `${new Intl.NumberFormat(resolvedLocale, { style: 'currency', currency: coupon.currencyCode }).format(majorAmount)} ${suffix}`;
}

export function formatAdminCouponsDate(value: string | undefined, locale: string): string {
  if (!value || !isValidAdminCouponsCalendarDate(value)) return '—';
  return format(parseISO(value), 'd MMM yyyy', { locale: locale.toLowerCase().startsWith('hi') ? hi : enIN });
}

export function escapeCouponHtml(text: string): string {
  return text.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function escapeCouponsCsvCell(value: unknown): string {
  const text = String(value ?? '');
  const isFiniteNumber = typeof value === 'number' && Number.isFinite(value);
  const safeText = !isFiniteNumber && /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

export function exportCouponsCsv(filteredCoupons: readonly AdminCouponsCoupon[]): void {
  const headers = ['Coupon ID', 'Code', 'Discount', 'Type', 'Valid Until', 'Max Uses', 'Used Count', 'Branch', 'Status'];
  const rows = filteredCoupons.map((c) => [
    c.id,
    c.code,
    c.discount,
    c.type,
    c.expiry || '',
    c.maxUses ?? '',
    c.usedCount ?? 0,
    c.branchApplicability || 'All Branches',
    c.status || 'Active',
  ].map(escapeCouponsCsvCell));
  const csvContent = '\uFEFF' + [headers.map(escapeCouponsCsvCell).join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'smart-library-coupons.csv';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${filteredCoupons.length} coupons to CSV`, { id: 'admin-coupons-export-csv' });
}

export function exportCouponsExcel(filteredCoupons: readonly AdminCouponsCoupon[]): void {
  const headers = ['Coupon ID', 'Code', 'Discount', 'Type', 'Valid Until', 'Max Uses', 'Used Count', 'Branch', 'Status'];
  const rows = filteredCoupons.map((c) => [
    c.id,
    c.code,
    c.type === 'Percent' ? `${c.discount}%` : `₹${c.discount}`,
    c.type,
    c.expiry || '—',
    c.maxUses ?? 'Unlimited',
    c.usedCount ?? 0,
    c.branchApplicability || 'All Branches',
    c.status || 'Active',
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #3b0764; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #581c87; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #faf5ff; }
      </style>
    </head>
    <body><table>
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeCouponHtml(String(cell ?? ''))}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></body></html>
  `.trim();
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'smart-library-coupons.xls';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${filteredCoupons.length} coupons to Excel (.xls)`, { id: 'admin-coupons-export-excel' });
}
