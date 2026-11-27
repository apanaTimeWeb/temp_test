'use client';
// RESPONSIBILITY: Owns the coupons page summary, KPI indicators, and explicit query result states.

import AdminMembersCouponsFlyerModal from '@/app/frontend_admin/admin_members/members_coupons/components/AdminMembersCouponsFlyerModal';
import type { AdminCouponsOverviewSectionProps } from '@/app/frontend_admin/admin_members/members_coupons/types/AdminMembersCouponsComponentTypes';
import {
  exportCouponsCsv,
  exportCouponsExcel,
  formatAdminCouponsDate,
  formatAdminCouponsDiscount,
  printCouponsRosterHtml,
} from '@/app/frontend_admin/admin_members/members_coupons/utils/adminMembersCouponsExports';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';
import { DataGrid } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { Download, FileSpreadsheet, Plus, Printer, Search, Tag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

export { formatAdminCouponsDate, formatAdminCouponsDiscount };

type CouponStatusFilter = 'All' | 'Active' | 'Expired' | 'Exhausted';

const STATUS_FILTER_OPTIONS: readonly CouponStatusFilter[] = ['All', 'Active', 'Expired', 'Exhausted'];

function parseStatusFilter(value: string): CouponStatusFilter {
  return STATUS_FILTER_OPTIONS.find((item) => item === value) ?? 'All';
}

/** Header, metrics, and results are one cohesive screen section; error/loading/empty states remain mutually exclusive. */
export default function AdminCouponsOverviewSection({
  isDemoMode,
  onCreateCoupon,
  onValidateDraft,
  coupons,
  columns,
  isError,
  isPending,
  onRetry,
}: AdminCouponsOverviewSectionProps) {
  const t = useTranslations('ADMIN_COUPONS');
  const [urlTablePage0, setUrlTablePage0] = useAdminApplicationInfrastructureUrlQueryState<number>('admin-coupons-admin-coupons-results-section-1-page', 0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CouponStatusFilter>('All');
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);

  const filteredCoupons = useMemo(() => {
    const q = search.trim().toLowerCase();
    return coupons.filter((c) => {
      const matchesSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        Boolean(c.branchApplicability && c.branchApplicability.toLowerCase().includes(q)) ||
        Boolean(c.status && c.status.toLowerCase().includes(q)) ||
        Boolean(c.type && c.type.toLowerCase().includes(q));
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [coupons, search, statusFilter]);

  const metrics = [
    {
      label: t('KPI_TOTAL_COUPONS'),
      value: coupons.length,
      iconBox: 'bg-info-bg border-info text-info-text',
      strokeColor: 'var(--chart-info)',
      badgeBg: 'border-info bg-info-bg text-info-text',
      trend: 'Active Catalog',
    },
    {
      label: t('KPI_ACTIVE'),
      value: coupons.filter((coupon) => coupon.status === 'Active').length,
      iconBox: 'bg-success-bg border-success text-success-text',
      strokeColor: 'var(--chart-success)',
      badgeBg: 'border-success bg-success-bg text-success-text',
      trend: 'Redeemable',
    },
    {
      label: t('KPI_EXPIRED'),
      value: coupons.filter((coupon) => coupon.status === 'Expired').length,
      iconBox: 'bg-danger-bg border-danger text-danger-text',
      strokeColor: 'var(--chart-danger)',
      badgeBg: 'border-danger bg-danger-bg text-danger-text',
      trend: 'Archived',
    },
    {
      label: t('KPI_TOTAL_USES'),
      value:
        coupons.length > 0 && coupons.every((coupon) => typeof coupon.usedCount === 'number')
          ? coupons.reduce((sum, coupon) => sum + (coupon.usedCount ?? 0), 0)
          : '—',
      iconBox: 'bg-warning-bg border-warning text-warning-text',
      strokeColor: 'var(--chart-warning)',
      badgeBg: 'border-warning bg-warning-bg text-warning-text',
      trend: 'Total Redemptions',
    },
  ];

  let results: React.ReactNode;
  if (isError) {
    results = (
      <section role="alert" className="rounded-2xl border border-danger bg-danger-bg p-6 text-danger-text">
        <p>{t('LOAD_ERROR')}</p>
        <button
          type="button"
          className="mt-3 rounded-xl border border-danger px-3 py-1.5 text-xs font-semibold text-danger-text hover:opacity-90"
          onClick={onRetry}
        >
          {t('RETRY')}
        </button>
      </section>
    );
  } else if (isPending) {
    results = (
      <section role="status" aria-busy="true" aria-label={t('LOADING')} className="space-y-3 rounded-2xl border border-border bg-card p-5 md:p-6">
        <span className="sr-only">{t('LOADING')}</span>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={`coupon-skeleton-card-${index + 1}`} className="h-10 rounded-xl bg-skeleton-base motion-safe:animate-pulse" />
          ))}
        </div>
        <div className="space-y-2 pt-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={`coupon-skeleton-row-${index + 1}`} className="h-11 rounded-xl bg-skeleton-highlight motion-safe:animate-pulse" />
          ))}
        </div>
      </section>
    );
  } else if (coupons.length === 0) {
    results = <AdminEmptyState showIcon={false} title={t('EMPTY_TITLE')} description={t('EMPTY_DESCRIPTION')} />;
  } else {
    results = (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" aria-hidden="true" />
              <input
                maxLength={100}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setUrlTablePage0(0);
                }}
                placeholder="Search coupons by code, branch, status..."
                aria-label="Search coupons"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-input text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(parseStatusFilter(e.target.value));
                setUrlTablePage0(0);
              }}
              aria-label="Filter coupons by status"
              className="h-9 px-3 text-xs rounded-xl border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border bg-purple-bg px-3 py-1.5 text-xs font-semibold text-purple hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              title="Generate & Print Coupon Flyers"
            >
              <Tag size={14} aria-hidden="true" />
              <span>Coupon Flyers</span>
            </button>
            <button
              type="button"
              onClick={() => exportCouponsCsv(filteredCoupons)}
              disabled={filteredCoupons.length === 0}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-info bg-info-bg px-3 py-1.5 text-xs font-medium text-info-text hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              title="Export Coupons to CSV"
            >
              <Download size={14} strokeWidth={2} aria-hidden="true" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={() => exportCouponsExcel(filteredCoupons)}
              disabled={filteredCoupons.length === 0}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-success bg-success-bg px-3 py-1.5 text-xs font-medium text-success-text hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              title="Export Coupons to Excel (.xls)"
            >
              <FileSpreadsheet size={14} strokeWidth={2} aria-hidden="true" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              onClick={() => printCouponsRosterHtml(filteredCoupons)}
              disabled={filteredCoupons.length === 0}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-border-focus bg-primary-subtle px-3 py-1.5 text-xs font-medium text-primary hover:opacity-90 motion-safe:transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              title="Print Coupons Roster"
            >
              <Printer size={14} strokeWidth={2} aria-hidden="true" />
              <span>Print</span>
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-surface-highlight">
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

        <AdminMembersCouponsFlyerModal isOpen={isFlyerModalOpen} onClose={() => setIsFlyerModalOpen(false)} coupons={filteredCoupons} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-text-primary">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 md:p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">{t('PAGE_TITLE')}</h1>
            <p className="text-xs sm:text-sm text-text-secondary">{t('PAGE_SUBTITLE')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!isDemoMode}
              aria-describedby="admin-coupons-mutation-note"
              title={isDemoMode ? t('DEMO_MODE_NOTICE') : t('MUTATIONS_UNAVAILABLE')}
              onClick={onCreateCoupon}
            >
              <Plus size={16} strokeWidth={2} aria-hidden="true" />
              <span>{t('CREATE_COUPON')}</span>
            </button>
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

      <section aria-label={t('KPI_SECTION_LABEL')} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]"
          >
            <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
              <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={metric.strokeColor} strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="relative z-10 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary truncate">{metric.label}</p>
                <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary tabular-nums" aria-live={isPending ? 'off' : 'polite'}>
                  {isPending ? t('KPI_LOADING') : isError ? '—' : metric.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${metric.iconBox}`}>
                <Tag size={18} strokeWidth={2.2} aria-hidden="true" />
              </div>
            </div>
            <div className="relative z-10 mt-3.5 pt-2.5 border-t border-border flex items-center gap-1.5">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-card ${metric.badgeBg}`}>
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
