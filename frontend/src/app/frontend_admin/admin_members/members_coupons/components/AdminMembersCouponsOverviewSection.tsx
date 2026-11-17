'use client';
// RESPONSIBILITY: Owns the coupons page summary, KPI indicators, and explicit query result states.

import { useTranslations } from 'next-intl';
import { Tag, Plus, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { DataGrid, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import { isValidAdminCouponsCalendarDate, type AdminCouponsCoupon } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import { format, parseISO } from 'date-fns';
import { enIN, hi } from 'date-fns/locale';
import type { AdminCouponsOverviewSectionProps } from '@/app/frontend_admin/admin_members/members_coupons/types/AdminMembersCouponsComponentTypes';


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

  const filteredCoupons = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coupons;
    return coupons.filter((c) =>
      c.code.toLowerCase().includes(q) ||
      (c.branchApplicability && c.branchApplicability.toLowerCase().includes(q)) ||
      (c.status && c.status.toLowerCase().includes(q)) ||
      (c.type && c.type.toLowerCase().includes(q))
    );
  }, [coupons, search]);

  const metrics = [
    {
      label: t('KPI_TOTAL_COUPONS'),
      value: coupons.length,
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      glow: 'bg-cyan-500/10 text-cyan-400',
      badge: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400',
      trend: 'Active Catalog',
    },
    {
      label: t('KPI_ACTIVE'),
      value: coupons.filter((coupon) => coupon.status === 'Active').length,
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      glow: 'bg-emerald-500/10 text-emerald-400',
      badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
      trend: 'Redeemable',
    },
    {
      label: t('KPI_EXPIRED'),
      value: coupons.filter((coupon) => coupon.status === 'Expired').length,
      border: 'border-rose-500/20 hover:border-rose-500/40',
      glow: 'bg-rose-500/10 text-rose-400',
      badge: 'border-rose-500/20 bg-rose-500/10 text-rose-400',
      trend: 'Archived',
    },
    {
      label: t('KPI_TOTAL_USES'),
      value: coupons.length > 0 && coupons.every((coupon) => typeof coupon.usedCount === 'number') ? coupons.reduce((sum, coupon) => sum + (coupon.usedCount ?? 0), 0) : '—',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      glow: 'bg-amber-500/10 text-amber-400',
      badge: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
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
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
    </div>
  );
  return (
    <div className="w-full space-y-6 text-text-primary">
      {/* EXECUTIVE HEADER */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400">
                {t('BREADCRUMB')}
              </span>
              <span className="text-xs text-slate-400">• Promotional Discounts</span>
            </div>
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
            className={`relative overflow-hidden rounded-2xl border ${metric.border} bg-slate-900/60 backdrop-blur-xl p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{metric.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-white" aria-live={isPending ? 'off' : 'polite'}>
                  {isPending ? t('KPI_LOADING') : isError ? '—' : metric.value}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.glow}`}>
                <Tag size={20} strokeWidth={2} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${metric.badge}`}>
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
