'use client';

/** Responsibility: renders the subscriptions overview owned by the canonical subscriptions route. */
/** Data-Flow: canonical route -> subscriber fixtures -> localized semantic table; pricing-plan workflows are owned by the plans/pricing-catalog feature. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/config/superadmin_subscriptions_overview.url_config.ts';
import { useMemo } from 'react';
import SuperadminSubscriptionsOverviewSemanticTable, { type SemanticColumnDef, type SemanticCellParams } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/components/SuperadminSubscriptionsOverviewSemanticTable';
import { SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/mocks/fixtures/SuperadminSubscriptionsOverviewMockFixtures';
import { Users, Package } from 'lucide-react';
import { formatSuperadminSubscriptionsMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_overview/utils/SuperadminSubscriptionsOverviewFormatters';
import { useTranslations, useLocale } from 'next-intl';
/** Derives a stable, non-index row identity for repeated interactive table controls. */
function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'subscriptionId', 'memberId', 'tenant', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

export default function SuperadminSubscriptionsOverviewPageClient() {
  const locale = useLocale();
  const t = useTranslations('SUPERADMIN_SUBSCRIPTIONS');
  const subscribers = SUPERADMIN_SUBSCRIPTIONS_SAMPLE_SUBSCRIBERS;

  const navigateToWorkflow = (route: string) => {
    const target = new URL(route, window.location.origin);
    const query = new URLSearchParams(window.location.search);
    query.delete('view');
    query.forEach((value, key) => {
      if (!target.searchParams.has(key)) target.searchParams.append(key, value);
    });
    window.location.assign(target.pathname + target.search + target.hash);
  };

  const tabs = [
    { name: t('COPY.NAV_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS'), icon: Users, route: SUPERADMIN_NAVIGATION_ROUTES.subscriptions_active_subscribers, current: true },
    { name: t('COPY.NAV_SAAS_PRICING_PLANS'), icon: Package, route: SUPERADMIN_NAVIGATION_ROUTES.plans_pricing_catalog, current: false },
  ];

  const colDefs = useMemo<SemanticColumnDef[]>(() => [
    { headerName: t('COPY.TABLE_COLUMN_TENANT'), field: 'tenant', flex: 2, cellClass: () => 'sa-cell-primary-bold' },
    { headerName: t('COPY.TABLE_COLUMN_PLAN'), field: 'plan', flex: 1.5, cellClass: () => 'sa-cell-plan' },
    {
      headerName: t('COPY.TABLE_COLUMN_CYCLE_MRR'), field: 'mrr', flex: 1,
      cellRenderer: (p: SemanticCellParams) => (
        <div>
          <p className="text-sm font-medium text-primary">{formatSuperadminSubscriptionsMajorPreviewCurrency(p.data?.mrr, 'INR', locale)}</p>
          <p className="text-xs text-secondary">{t(`COPY.CYCLE_${String(p.data?.cycle ?? '').toUpperCase()}` as 'COPY.CYCLE_MONTHLY' | 'COPY.CYCLE_YEARLY' | 'COPY.CYCLE_ANNUALLY')}</p>
        </div>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_STATUS'), field: 'status', flex: 1,
      cellRenderer: (p: SemanticCellParams) => (
        <span className={`sa-badge ${p.value === 'Paid' ? 'sa-badge--success' : p.value === 'Due Soon' ? 'sa-badge--warning' : 'sa-badge--danger'}`}>
          {p.value === 'Paid' ? t('COPY.STATUS_PAID') : p.value === 'Due Soon' ? t('COPY.STATUS_DUE_SOON') : t('COPY.STATUS_OVERDUE')}
        </span>
      ),
    },
    {
      headerName: t('COPY.TABLE_COLUMN_ACTIONS'), flex: 1,
      cellRenderer: (p: SemanticCellParams) => p.data ? (
        <button type="button" disabled aria-disabled="true" title={t('COPY.UNAVAILABLE_PAYMENT_STATUS_IS_SERVER_OWNED_AND_NO_STATUS_MUTATION_API_CONTRACT_IS_SUPPLIED')} className="text-secondary text-xs font-bold border border-border px-3 py-1.5 rounded bg-surface-hover opacity-60 cursor-not-allowed" data-testid={`superadmin-subscriptions-subscriptions-overview-unavailable-payment-status-${getSuperadminInteractiveTestIdSuffix(p.data)}`}>
          {t('COPY.CHANGE_UNAVAILABLE')}
        </button>
      ) : null,
    },
  ], [locale, t]);

  return (
    <div className="sa-page-animate relative">
      <p className="mb-4 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">
        {t('COPY.SUBSCRIBER_AND_PRICING_PLAN_RECORDS_ARE_SAMPLE_DATA_EDITING_A_PLAN_IS_A_LOCAL_PREVIEW_NO_SUBSCRIBER_PAYMENT_OR_PLAN_MUTATION_API_CONTRACT_IS_SUPPLIED')}
      </p>
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb"><span>{t('COPY.LIBRARY_OS')}</span><span>/</span><span>{t('COPY.SUPER_ADMIN')}</span><span>/</span><span>{t('COPY.SUBSCRIPTIONS')}</span></div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title">{t('COPY.SAAS_SUBSCRIPTIONS')}</h1>
        </div>
      </div>
      <nav className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto hide-scrollbar" aria-label={t('COPY.SUBSCRIPTION_SECTIONS')}>
        {tabs.map((tab) => (
          <button
            key={tab.route}
            type="button"
            aria-current={tab.current ? 'page' : undefined}
            onClick={() => navigateToWorkflow(tab.route)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold motion-safe:transition-all motion-reduce:transition-none whitespace-nowrap ${tab.current ? 'bg-info-bg text-primary border border-border shadow-card' : 'text-secondary hover:bg-surface-hover hover:text-primary'}`}
            data-testid={`superadmin-subscriptions-subscriptions-overview-navigate-${tab.current ? 'active-subscribers' : 'pricing-plans'}`}
          >
            <tab.icon size={16} aria-hidden="true" /> {tab.name}
          </button>
        ))}
      </nav>
      <div className="sa-card p-0 overflow-hidden h-150 flex flex-col">
        <div className="flex-1 w-full motion-safe:animate-fade-in motion-reduce:animate-none">
          <SuperadminSubscriptionsOverviewSemanticTable rowData={subscribers} columnDefs={colDefs} pagination paginationPageSize={10} getRowId={({ data }) => String(data.id ?? data.tenant)} />
        </div>
      </div>
    </div>
  );
}
