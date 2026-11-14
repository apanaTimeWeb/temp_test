'use client';
/** Responsibility: Superadmin Reports Analytics Chart; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminAnalyticsSubscriptionMixAnalyticsChart formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';
import { useLocale, useTranslations } from 'next-intl';
import { getSuperadminReportsVisiblePointCount } from '@/app/frontend_superadmin/superadmin_analytics/analytics_subscription_mix/utils/SuperadminAnalyticsSubscriptionMixDateRangeUtilities';
import {
  SUPERADMIN_REPORT_GROWTH_FIXTURES,
  SUPERADMIN_REPORT_PLAN_FIXTURES,
  SUPERADMIN_REPORT_REVENUE_FIXTURES,
} from '@/app/frontend_superadmin/superadmin_analytics/analytics_subscription_mix/mocks/fixtures/SuperadminAnalyticsSubscriptionMixMockFixtures';
import { SUPERADMIN_REPORTS_ANALYTICS_CHART_COMMON } from '@/app/frontend_superadmin/superadmin_analytics/analytics_subscription_mix/constants/SuperadminAnalyticsSubscriptionMixStaticConstants';
import type { SuperadminReportsAnalyticsChartProps } from '@/app/frontend_superadmin/superadmin_analytics/analytics_subscription_mix/types/SuperadminAnalyticsSubscriptionMixAnalyticsChartComponentTypes';
import { formatSuperadminAnalyticsSubscriptionMixMonthLabel } from '@/app/frontend_superadmin/superadmin_analytics/analytics_subscription_mix/utils/SuperadminAnalyticsSubscriptionMixMonthLabelFormatter';


const SuperadminReportsApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });



/** Charts the explicitly labelled preview fixtures until a live report contract is supplied. */
export default function SuperadminAnalyticsSubscriptionMixAnalyticsChart({ activeTab, dateRange }: SuperadminReportsAnalyticsChartProps) {
  const locale = useLocale();
  const tCopy = useTranslations('SUPERADMIN_REPORTS');
  const pointCount = getSuperadminReportsVisiblePointCount(dateRange, SUPERADMIN_REPORT_REVENUE_FIXTURES.length);
  const revenue = SUPERADMIN_REPORT_REVENUE_FIXTURES.slice(-pointCount);
  const growth = SUPERADMIN_REPORT_GROWTH_FIXTURES.slice(-pointCount);

  

  if (activeTab === 'Tenant Growth') {
    const options: ApexOptions = {
      ...SUPERADMIN_REPORTS_ANALYTICS_CHART_COMMON,
      chart: { ...SUPERADMIN_REPORTS_ANALYTICS_CHART_COMMON.chart, type: 'bar' },
      xaxis: { categories: growth.map((point) => formatSuperadminAnalyticsSubscriptionMixMonthLabel(point.month, locale)) },
      colors: ['var(--chart-success)', 'var(--chart-danger)'],
      plotOptions: { bar: { columnWidth: '48%', borderRadius: 3 } },
    };
    return <SuperadminReportsApexChart type="bar" height="100%" options={options} series={[
      { name: tCopy('COPY.CHART_ACTIVE_TENANTS_SAMPLE'), data: growth.map(point => point.active) },
      { name: tCopy('COPY.CHART_CHURNED_TENANTS_SAMPLE'), data: growth.map(point => point.churned) },
    ]} />;
  }

  if (activeTab === 'Subscription Mix') {
    const options: ApexOptions = {
      ...SUPERADMIN_REPORTS_ANALYTICS_CHART_COMMON,
      chart: { ...SUPERADMIN_REPORTS_ANALYTICS_CHART_COMMON.chart, type: 'donut' },
      labels: SUPERADMIN_REPORT_PLAN_FIXTURES.map(point => point.name),
      colors: ['var(--chart-info)', 'var(--chart-primary)', 'var(--chart-warning)'],
      legend: { ...SUPERADMIN_REPORTS_ANALYTICS_CHART_COMMON.legend, position: 'bottom' },
      stroke: { width: 0 },
    };
    return <SuperadminReportsApexChart type="donut" height="100%" options={options} series={SUPERADMIN_REPORT_PLAN_FIXTURES.map(point => point.value)} />;
  }

  const options: ApexOptions = {
    ...SUPERADMIN_REPORTS_ANALYTICS_CHART_COMMON,
    chart: { ...SUPERADMIN_REPORTS_ANALYTICS_CHART_COMMON.chart, type: 'area' },
    xaxis: { categories: revenue.map((point) => formatSuperadminAnalyticsSubscriptionMixMonthLabel(point.month, locale)) },
    colors: ['var(--chart-primary)', 'var(--chart-info)'],
    fill: { type: 'solid', opacity: 0.12 },
  };
  return <SuperadminReportsApexChart type="area" height="100%" options={options} series={[
    { name: tCopy('COPY.CHART_MRR_SAMPLE'), data: revenue.map(point => point.mrr) },
    { name: tCopy('COPY.CHART_TARGET_SAMPLE'), data: revenue.map(point => point.target) },
  ]} />;
}
