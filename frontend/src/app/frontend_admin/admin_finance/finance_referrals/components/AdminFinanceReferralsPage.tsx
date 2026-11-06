'use client';
// Responsibility: AdminFinanceReferralsPage component owned by admin_finance; responsibility folder: admin_finance_components_views.

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { Search } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_FINANCE_DEMO_REFERRERS } from '@/app/frontend_admin/admin_finance/finance_referrals/mocks/AdminFinanceReferralsDemoFixtures';
import {
  AdminFinanceReferralsTimeHorizonBar,
  type AdminFinanceReferralsTimeHorizon,
} from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsTimeHorizonBar';
import { AdminFinanceReferralsKpiCards } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsKpiCards';
import {
  AdminFinanceReferralsTable,
  type ReferralsSortField,
} from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsTable';

export function AdminFinanceReferralsPage() {
  const t = useTranslations('ADMIN_FINANCE_REFERRALS');
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<ReferralsSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Time Horizon State
  const [timeRange, setTimeRange] = useState<AdminFinanceReferralsTimeHorizon>('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const timeRangeLabel = useMemo(() => {
    switch (timeRange) {
      case 'all':
        return 'All Time';
      case 'today':
        return 'Today';
      case 'this_week':
        return 'This Week';
      case 'this_month':
        return 'This Month';
      case 'custom':
        return 'Custom Range';
      default:
        return 'All Time';
    }
  }, [timeRange]);

  const toggleSort = (field: ReferralsSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const { selectedBranch, isAllBranches } = useAdminBranch();

  const filteredReferrers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ADMIN_FINANCE_DEMO_REFERRERS.filter((r) => {
      const matchBranch = isAllBranches || !selectedBranch || !r.branch || r.branch.toLowerCase().includes(selectedBranch.name.toLowerCase());
      const matchSearch = !q ||
        r.name.toLowerCase().includes(q) ||
        (r as unknown as { smartId?: string }).smartId?.toLowerCase().includes(q) ||
        r.referredNames.some((rn) => rn.toLowerCase().includes(q));
      return matchBranch && matchSearch;
    });
  }, [search, isAllBranches, selectedBranch]);

  // Dynamically compute horizon-scaled KPIs
  const horizonMultiplier = useMemo(() => {
    switch (timeRange) {
      case 'today':
        return 0.12;
      case 'this_week':
        return 0.35;
      case 'this_month':
        return 0.85;
      case 'custom':
        return 0.6;
      case 'all':
      default:
        return 1.0;
    }
  }, [timeRange]);

  const totalReferrals = useMemo(() => {
    const raw = filteredReferrers.reduce((a, referrer) => a + referrer.referredNames.length, 0);
    return Math.max(1, Math.round(raw * horizonMultiplier));
  }, [filteredReferrers, horizonMultiplier]);

  const totalBonus = useMemo(() => {
    const raw = filteredReferrers.reduce((a, r) => a + r.bonusEarned, 0);
    return Math.round(raw * horizonMultiplier);
  }, [filteredReferrers, horizonMultiplier]);

  const topReferrer = useMemo(() => {
    return [...filteredReferrers].sort((left, right) => right.referredNames.length - left.referredNames.length)[0] ?? { name: '—', referredNames: [] as string[] };
  }, [filteredReferrers]);

  const sortedReferrers = useMemo(() => {
    if (!sortField) return filteredReferrers;
    return [...filteredReferrers].sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortField === 'name') {
        aVal = a.name;
        bVal = b.name;
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' })
          : bVal.localeCompare(aVal, undefined, { numeric: true, sensitivity: 'base' });
      } else if (sortField === 'referredCount') {
        aVal = a.referredNames.length;
        bVal = b.referredNames.length;
      } else if (sortField === 'bonusEarned') {
        aVal = a.bonusEarned;
        bVal = b.bonusEarned;
      } else if (sortField === 'redeemed') {
        aVal = a.redeemed;
        bVal = b.redeemed;
      } else if (sortField === 'balance') {
        aVal = a.bonusEarned - a.redeemed;
        bVal = b.bonusEarned - b.redeemed;
      }
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [filteredReferrers, sortField, sortDirection]);

  const paginatedReferrers = useMemo(
    () => sortedReferrers.slice(page * pageSize, (page + 1) * pageSize),
    [sortedReferrers, page, pageSize]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  if (!isFrontendDemoModeEnabled()) {
    return (
      <div className="rounded-lg border border-border bg-card p-6" role="status">
        <h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
        <p className="mt-2 text-text-secondary">{t('LIVE_UNAVAILABLE')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
        <p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
      </div>

      {/* Global Time Horizon Selector */}
      <AdminFinanceReferralsTimeHorizonBar
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
        timeRangeLabel={timeRangeLabel}
        activeCount={filteredReferrers.length}
      />

      {/* KPI Cards with Dynamic Period Badges */}
      <AdminFinanceReferralsKpiCards
        totalReferrals={totalReferrals}
        totalBonus={totalBonus}
        topReferrer={topReferrer}
        timeRangeLabel={timeRangeLabel}
      />

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
          <input
            type="text"
            placeholder="Search referrer or student name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="min-h-11 w-full rounded-md border border-border bg-input pl-9 pr-3 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Presentational Referrals Table */}
      <AdminFinanceReferralsTable
        paginatedReferrers={paginatedReferrers}
        filteredCount={filteredReferrers.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newSize: number) => {
          setPageSize(newSize);
          setPage(0);
        }}
        isLoading={isLoading}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        expandedId={expanded}
        onToggleExpand={setExpanded}
      />
    </div>
  );
}

export default AdminFinanceReferralsPage;
