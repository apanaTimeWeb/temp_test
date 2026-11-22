'use client';
// RESPONSIBILITY: Owns the coupons page summary, KPI indicators, and explicit query result states.

import AdminMembersCouponsFlyerModal from '@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsFlyerModal';
import { isValidAdminCouponsCalendarDate,type AdminCouponsCoupon } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import type { AdminCouponsOverviewSectionProps } from '@/app/frontend_admin/admin_members/members_coupons/types/AdminMembersCouponsComponentTypes';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { format,parseISO } from 'date-fns';
import { enIN,hi } from 'date-fns/locale';
import { Download,FileSpreadsheet,Plus,Printer,Search,Tag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo,useState } from 'react';
import { toast } from 'sonner';


export function formatAdminCouponsDiscount(coupon: Pick<AdminCouponsCoupon, 'discount' | 'type' | 'currencyCode' | 'amountUnit'>, locale: string, suffix: string): string {
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

/** Header, metrics, and results are one cohesive screen section; error/loading/empty states remain mutually exclusive. */
export default function AdminCouponsOverviewSection({ isDemoMode, onCreateCoupon, onValidateDraft, coupons, columns, isError, isPending, onRetry }: AdminCouponsOverviewSectionProps) {
  const t = useTranslations('ADMIN_COUPONS');
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-coupons-admin-coupons-results-section-1-page', 0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Expired' | 'Exhausted'>('All');
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);

  const filteredCoupons = useMemo(() => {
    const q = search.trim().toLowerCase();
    return coupons.filter((c) => {
      const matchesSearch = !q || (
        c.code.toLowerCase().includes(q) ||
        (c.branchApplicability && c.branchApplicability.toLowerCase().includes(q)) ||
        (c.status && c.status.toLowerCase().includes(q)) ||
        (c.type && c.type.toLowerCase().includes(q))
      );
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, statusFilter]);

  const downloadCouponsCsv = () => {
    const headers = ['Coupon ID', 'Code', 'Discount', 'Type', 'Valid Until', 'Max Uses', 'Used Count', 'Branch', 'Status'];
    const rows = filteredCoupons.map((c) => [
      `"${c.id}"`,
      `"${c.code}"`,
      c.discount,
      `"${c.type}"`,
      `"${c.expiry || ''}"`,
      c.maxUses ?? '',
      c.usedCount ?? 0,
      `"${(c.branchApplicability || 'All Branches').replaceAll('"', '""')}"`,
      `"${c.status || 'Active'}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'smart-library-coupons.csv';
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`Exported ${filteredCoupons.length} coupons to CSV`);
  };

  const downloadCouponsExcel = () => {
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
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Coupons</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
          th { background-color: #3b0764; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #581c87; text-align: left; }
          td { padding: 8px; border: 1px solid #cbd5e1; }
          tr:nth-child(even) { background-color: #faf5ff; }
        </style>
      </head>
      <body>
        <table>
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
      </html>
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
    toast.success(`Exported ${filteredCoupons.length} coupons to Excel (.xls)`);
  };

  const printCouponsRoster = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) { window.print(); return; }
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Smart Library - Promotional Coupons & Discounts</title>
          <style>
            @page { size: landscape; margin: 10mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #7e22ce; padding-bottom: 10px; margin-bottom: 12px; }
            .title { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #7e22ce; letter-spacing: 0.5px; }
            .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
            .meta { font-size: 11px; text-align: right; color: #475569; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th { background-color: #f3e8ff; color: #6b21a8; text-align: left; padding: 6px; border: 1px solid #e9d5ff; font-weight: 700; text-transform: uppercase; font-size: 10px; }
            td { padding: 6px; border: 1px solid #e2e8f0; }
            tr:nth-child(even) { background-color: #faf5ff; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
            .badge-active { background: #dcfce7; color: #15803d; }
            .badge-expired { background: #fee2e2; color: #b91c1c; }
            .badge-disabled { background: #f1f5f9; color: #475569; }
            .footer { margin-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">Smart Library Network · Promotional Coupons Registry</div>
              <div class="subtitle">Discounts & Referral Codes · Total Coupons: ${filteredCoupons.length}</div>
            </div>
            <div class="meta">
              <div><strong>Generated:</strong> ${dateStr}</div>
              <div><strong>Scope:</strong> Admin Authorized View</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Valid Until</th>
                <th>Max Uses</th>
                <th>Redeemed</th>
                <th>Branch</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredCoupons.map((c) => `
                <tr>
                  <td><strong style="font-family:monospace; color:#6b21a8;">${c.code}</strong></td>
                  <td>${c.type === 'Percent' ? `${c.discount}%` : `₹${c.discount}`}</td>
                  <td>${c.type}</td>
                  <td>${c.expiry || '—'}</td>
                  <td>${c.maxUses ?? 'Unlimited'}</td>
                  <td>${c.usedCount ?? 0}</td>
                  <td>${c.branchApplicability || 'All Branches'}</td>
                  <td><span class="badge badge-${(c.status || 'Active').toLowerCase()}">${c.status || 'Active'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <span>Smart Library Marketing & Promotions</span>
            <span>Page 1 of 1</span>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const metrics = [
    {
      label: t('KPI_TOTAL_COUPONS'),
      value: coupons.length,
      cardBorderBg: 'border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30',
      iconBox: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
      strokeColor: '#22d3ee',
      badgeBg: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-400',
      trend: 'Active Catalog',
    },
    {
      label: t('KPI_ACTIVE'),
      value: coupons.filter((coupon) => coupon.status === 'Active').length,
      cardBorderBg: 'border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30',
      iconBox: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      strokeColor: '#34d399',
      badgeBg: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
      trend: 'Redeemable',
    },
    {
      label: t('KPI_EXPIRED'),
      value: coupons.filter((coupon) => coupon.status === 'Expired').length,
      cardBorderBg: 'border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30',
      iconBox: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      strokeColor: '#f87171',
      badgeBg: 'border-rose-500/30 bg-rose-500/15 text-rose-400',
      trend: 'Archived',
    },
    {
      label: t('KPI_TOTAL_USES'),
      value: coupons.length > 0 && coupons.every((coupon) => typeof coupon.usedCount === 'number') ? coupons.reduce((sum, coupon) => sum + (coupon.usedCount ?? 0), 0) : '—',
      cardBorderBg: 'border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30',
      iconBox: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      strokeColor: '#fbbf24',
      badgeBg: 'border-amber-500/30 bg-amber-500/15 text-amber-400',
      trend: 'Total Redemptions',
    },
  ];
  let results: React.ReactNode;
  if (isError) results = <section role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-rose-400"><p>{t('LOAD_ERROR')}</p><button type="button" className="mt-3 rounded-xl border border-rose-500/40 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20" onClick={onRetry}>{t('RETRY')}</button></section>;
  else if (isPending) results = <section role="status" aria-busy="true" aria-label={t('LOADING')} className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 md:p-6"><span className="sr-only">{t('LOADING')}</span><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={`coupon-skeleton-card-${index + 1}`} className="h-10 rounded-xl bg-slate-800/50 motion-safe:animate-pulse" />)}</div><div className="space-y-2 pt-3">{Array.from({ length: 5 }, (_, index) => <div key={`coupon-skeleton-row-${index + 1}`} className="h-11 rounded-xl bg-slate-800/40 motion-safe:animate-pulse" />)}</div></section>;
  else if (coupons.length === 0) results = <AdminEmptyState showIcon={false} title={t('EMPTY_TITLE')} description={t('EMPTY_DESCRIPTION')} />;
  else results = (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-5 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setUrlTablePage0(0);
              }}
              placeholder="Search coupons by code, branch, status..."
              aria-label="Search coupons"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950/60 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setUrlTablePage0(0);
            }}
            aria-label="Filter coupons by status"
            className="h-9 px-3 text-xs rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Expired">Expired</option>
            <option value="Exhausted">Exhausted</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFlyerModalOpen(true)}
            disabled={filteredCoupons.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:text-white hover:bg-purple-500/20 transition-all disabled:cursor-not-allowed disabled:opacity-40"
            title="Generate & Print Coupon Flyers"
          >
            <Tag size={14} className="text-purple-400" />
            <span>Coupon Flyers</span>
          </button>
          <button
            type="button"
            onClick={downloadCouponsCsv}
            disabled={filteredCoupons.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            title="Export Coupons to CSV"
          >
            <Download size={14} strokeWidth={2} className="text-cyan-400" />
            <span>CSV</span>
          </button>
          <button
            type="button"
            onClick={downloadCouponsExcel}
            disabled={filteredCoupons.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            title="Export Coupons to Excel (.xls)"
          >
            <FileSpreadsheet size={14} strokeWidth={2} className="text-emerald-400" />
            <span>Excel</span>
          </button>
          <button
            type="button"
            onClick={printCouponsRoster}
            disabled={filteredCoupons.length === 0}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 hover:text-white hover:bg-sky-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            title="Print Coupons Roster"
          >
            <Printer size={14} strokeWidth={2} className="text-sky-400" />
            <span>Print</span>
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/20">
        <DataGrid
          rowData={filteredCoupons}
          columnDefs={columns}
          pagination
          pageSize={25}
          emptyMessage={t('EMPTY_TITLE')}
          page={urlTablePage0}
          onPageChange={setUrlTablePage0}
        />
      </div>

      <AdminMembersCouponsFlyerModal
        isOpen={isFlyerModalOpen}
        onClose={() => setIsFlyerModalOpen(false)}
        coupons={filteredCoupons}
      />
    </div>
  );
  return (
    <div className="w-full space-y-6 text-text-primary">
      {/* EXECUTIVE HEADER */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{t('PAGE_TITLE')}</h1>
            <p className="text-xs sm:text-sm text-slate-400">{t('PAGE_SUBTITLE')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 transition-all disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!isDemoMode}
              aria-describedby="admin-coupons-mutation-note"
              title={isDemoMode ? t('DEMO_MODE_NOTICE') : t('MUTATIONS_UNAVAILABLE')}
              onClick={onCreateCoupon}
            >
              <Plus size={16} strokeWidth={2}/>
              <span>{t('CREATE_COUPON')}</span>
            </button>
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              onClick={onValidateDraft}
            >
              {t('VALIDATE_DRAFT')}
            </button>
          </div>
        </div>
      </div>

      <div id="admin-coupons-mutation-note" role="status" className="sr-only">
        <span>{isDemoMode ? t('DEMO_MODE_NOTICE') : t('MUTATIONS_UNAVAILABLE')}</span>
      </div>

      {/* 4 KPI CARDS */}
      <section aria-label={t('KPI_SECTION_LABEL')} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${metric.cardBorderBg}`}
          >
            <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
              <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={metric.strokeColor} strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="relative z-10 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{metric.label}</p>
                <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums" aria-live={isPending ? 'off' : 'polite'}>
                  {isPending ? t('KPI_LOADING') : isError ? '—' : metric.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs ${metric.iconBox}`}>
                <Tag size={18} strokeWidth={2.2} />
              </div>
            </div>
            <div className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 flex items-center gap-1.5">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-xs ${metric.badgeBg}`}>
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </section>

      {results}
    </div>
  );
}


export type { AdminCouponsOverviewSectionProps };
