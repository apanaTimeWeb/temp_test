'use client';
// RESPONSIBILITY: Owns the coupons page summary, KPI indicators, and explicit query result states.

import { useTranslations } from 'next-intl';
import { Tag, Plus } from 'lucide-react';
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
  const metrics = [
    { label: t('KPI_TOTAL_COUPONS'), value: coupons.length, background: 'bg-primary-subtle', foreground: 'text-primary' },
    { label: t('KPI_ACTIVE'), value: coupons.filter((coupon) => coupon.status === 'Active').length, background: 'bg-success-bg', foreground: 'text-success-text' },
    { label: t('KPI_EXPIRED'), value: coupons.filter((coupon) => coupon.status === 'Expired').length, background: 'bg-danger-bg', foreground: 'text-danger-text' },
    { label: t('KPI_TOTAL_USES'), value: coupons.length > 0 && coupons.every((coupon) => typeof coupon.usedCount === 'number') ? coupons.reduce((sum, coupon) => sum + (coupon.usedCount ?? 0), 0) : '—', background: 'bg-warning-bg', foreground: 'text-warning-text' },
  ];
  let results: React.ReactNode;
  if (isError) results = <section role="alert" className="rounded-lg border border-danger-text bg-danger-bg p-6 text-danger-text"><p>{t('LOAD_ERROR')}</p><button type="button" className="mt-3 min-h-11 rounded-md border border-border px-3 py-2 text-primary" onClick={onRetry}>{t('RETRY')}</button></section>;
  else if (isPending) results = <section role="status" aria-busy="true" aria-label={t('LOADING')} className="space-y-3 rounded-lg border border-border bg-card p-4 sm:p-6"><span className="sr-only">{t('LOADING')}</span><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={`coupon-skeleton-card-${index + 1}`} className="h-10 rounded bg-skeleton-base motion-safe:animate-pulse" />)}</div><div className="space-y-2 pt-3">{Array.from({ length: 5 }, (_, index) => <div key={`coupon-skeleton-row-${index + 1}`} className="h-11 rounded bg-skeleton-highlight motion-safe:animate-pulse" />)}</div></section>;
  else if (coupons.length === 0) results = <AdminEmptyState showIcon={false} title={t('EMPTY_TITLE')} description={t('EMPTY_DESCRIPTION')} />;
  else results = <DataGrid rowData={[...coupons]} columnDefs={columns} pagination pageSize={25} emptyMessage={t('EMPTY_TITLE')} page={urlTablePage0} onPageChange={setUrlTablePage0} />;
  return <div className="space-y-6">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0 space-y-1"><p className="text-caption text-text-secondary">{t('BREADCRUMB')}</p><h1 className="text-page-title font-bold text-text-primary">{t('PAGE_TITLE')}</h1><p className="text-sm text-text-secondary">{t('PAGE_SUBTITLE')}</p></div><div className="flex flex-wrap items-center gap-3"><button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border px-4 py-2 text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:text-text-disabled" disabled={!isDemoMode} aria-describedby="admin-coupons-mutation-note" title={isDemoMode ? t('DEMO_MODE_NOTICE') : t('MUTATIONS_UNAVAILABLE')} onClick={onCreateCoupon}><Plus size={18} strokeWidth={2}/>{t('CREATE_COUPON')}</button><button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-on-primary hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={onValidateDraft}>{t('VALIDATE_DRAFT')}</button></div></header>
    <p id="admin-coupons-mutation-note" role="status" className="rounded-lg border border-warning-bg bg-warning-bg p-3 text-sm text-warning-text">{isDemoMode ? t('DEMO_MODE_NOTICE') : t('MUTATIONS_UNAVAILABLE')}</p>
    <section aria-label={t('KPI_SECTION_LABEL')} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <div key={metric.label} className="flex min-h-28 items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${metric.background}`} aria-hidden="true"><Tag size={18} strokeWidth={2} className={metric.foreground}/></div><div className="min-w-0"><p className="text-caption text-text-secondary">{metric.label}</p><p className="text-kpi font-bold text-text-primary" aria-live={isPending ? 'off' : 'polite'}>{isPending ? t('KPI_LOADING') : isError ? '—' : metric.value}</p></div></div>)}</section>
    {results}
  </div>;
}


export type { AdminCouponsOverviewSectionProps };
