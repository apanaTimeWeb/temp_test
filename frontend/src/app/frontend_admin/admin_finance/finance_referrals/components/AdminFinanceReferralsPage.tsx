'use client';
// Responsibility: AdminFinanceReferralsPage component owned by admin_finance; responsibility folder: admin_finance_components_views.

import { AdminFinanceReferralPayoutVoucherModal } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralPayoutVoucherModal';
import { AdminFinanceReferralsKpiCards } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsKpiCards';
import { AdminFinanceReferralsRedeemModal } from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsRedeemModal';
import {
  AdminFinanceReferralsTable,
  type ReferralsSortField,
} from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsTable';
import {
  AdminFinanceReferralsTimeHorizonBar,
  type AdminFinanceReferralsTimeHorizon,
} from '@/app/frontend_admin/admin_finance/finance_referrals/components/AdminFinanceReferralsTimeHorizonBar';
import { ADMIN_FINANCE_DEMO_REFERRERS } from '@/app/frontend_admin/admin_finance/finance_referrals/config/admin_finance_referrals.demo_data';
import type { AdminFinanceDemoReferrer, ReferralPayoutVoucher } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';
import {
  exportReferralsCsv,
  exportReferralsExcel,
  printReferralsLeaderboard,
} from '@/app/frontend_admin/admin_finance/finance_referrals/utils/adminFinanceReferralsExports';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { Download, FileSpreadsheet, Printer, RotateCcw, Search, Users2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

export function AdminFinanceReferralsPage() {
  const t = useTranslations('ADMIN_FINANCE_REFERRALS');
  const [referrers, setReferrers] = useState<AdminFinanceDemoReferrer[]>(ADMIN_FINANCE_DEMO_REFERRERS);
  const [redeemTarget, setRedeemTarget] = useState<AdminFinanceDemoReferrer | null>(null);
  const [payoutVouchers, setPayoutVouchers] = useState<ReferralPayoutVoucher[]>([]);
  const [activeVoucher, setActiveVoucher] = useState<ReferralPayoutVoucher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<ReferralsSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [timeRange, setTimeRange] = useState<AdminFinanceReferralsTimeHorizon>('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const { selectedBranch, isAllBranches } = useAdminBranch();

  const timeRangeLabel = timeRange === 'all' ? 'All Time' : timeRange === 'today' ? 'Today' : timeRange === 'this_week' ? 'This Week' : timeRange === 'this_month' ? 'This Month' : 'Custom Range';

  const toggleSort = (field: ReferralsSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleConfirmRedeem = (
    referrerId: number,
    amountMinor: number,
    mode: 'fee_adjustment' | 'cash_upi',
    notes: string,
    voucherMeta?: { subChannel?: string; utrReference?: string; invoiceCreditNote?: string },
  ) => {
    const target = referrers.find((r) => r.id === referrerId);
    const newVoucher: ReferralPayoutVoucher = {
      voucherId: `PV-REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      referrerId,
      studentName: target?.name ?? 'Student',
      smartId: target?.smartId ?? 'SL-000',
      branch: target?.branch ?? selectedBranch?.name ?? 'Downtown Central',
      amountMinor,
      mode,
      subChannel: voucherMeta?.subChannel,
      utrReference: voucherMeta?.utrReference,
      invoiceCreditNote: voucherMeta?.invoiceCreditNote,
      disbursedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      authorizedBy: 'Smart Library Treasury & Accounts',
      notes,
    };

    setPayoutVouchers((prev) => [newVoucher, ...prev]);
    setActiveVoucher(newVoucher);
    setReferrers((prev) =>
      prev.map((r) => (r.id === referrerId ? { ...r, redeemed: r.redeemed + amountMinor, balance: Math.max(0, r.balance - amountMinor) } : r)),
    );
  };

  const handleViewVoucher = (referrer: AdminFinanceDemoReferrer) => {
    const existing = payoutVouchers.find((v) => v.referrerId === referrer.id);
    if (existing) {
      setActiveVoucher(existing);
      return;
    }
    setActiveVoucher({
      voucherId: `PV-REF-${new Date().getFullYear()}-${1000 + referrer.id}`,
      referrerId: referrer.id,
      studentName: referrer.name,
      smartId: referrer.smartId,
      branch: referrer.branch ?? selectedBranch?.name ?? 'Downtown Central',
      amountMinor: referrer.redeemed > 0 ? referrer.redeemed : 50000,
      mode: 'fee_adjustment',
      subChannel: 'Fee Credit Note',
      invoiceCreditNote: `CR-REF-${new Date().getFullYear()}-${2000 + referrer.id}`,
      disbursedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      authorizedBy: 'Smart Library Accounts',
      notes: 'Historical referral reward bonus clearance adjusted against library subscription ledger',
    });
  };

  const filteredReferrers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return referrers.filter((r) => {
      const matchBranch = isAllBranches || !selectedBranch || !r.branch || r.branch.toLowerCase().includes(selectedBranch.name.toLowerCase());
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.smartId?.toLowerCase().includes(q) || r.referredNames.some((rn) => rn.toLowerCase().includes(q));
      return matchBranch && matchSearch;
    });
  }, [search, isAllBranches, selectedBranch, referrers]);

  const horizonMultiplier = timeRange === 'today' ? 0.12 : timeRange === 'this_week' ? 0.35 : timeRange === 'this_month' ? 0.85 : timeRange === 'custom' ? 0.6 : 1.0;

  const totalReferrals = useMemo(
    () => Math.max(1, Math.round(filteredReferrers.reduce((a, referrer) => a + referrer.referredNames.length, 0) * horizonMultiplier)),
    [filteredReferrers, horizonMultiplier],
  );
  const totalBonus = useMemo(
    () => Math.round(filteredReferrers.reduce((a, r) => a + r.bonusEarned, 0) * horizonMultiplier),
    [filteredReferrers, horizonMultiplier],
  );
  const topReferrer = useMemo(
    () => [...filteredReferrers].sort((left, right) => right.referredNames.length - left.referredNames.length)[0] ?? { name: '—', referredNames: [] as string[] },
    [filteredReferrers],
  );

  const sortedReferrers = useMemo(() => {
    if (!sortField) return filteredReferrers;
    return [...filteredReferrers].sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
          : b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' });
      }
      const val = (item: AdminFinanceDemoReferrer) =>
        sortField === 'referredCount' ? item.referredNames.length : sortField === 'bonusEarned' ? item.bonusEarned : sortField === 'redeemed' ? item.redeemed : item.bonusEarned - item.redeemed;
      return sortDirection === 'asc' ? val(a) - val(b) : val(b) - val(a);
    });
  }, [filteredReferrers, sortField, sortDirection]);

  const paginatedReferrers = useMemo(() => sortedReferrers.slice(page * pageSize, (page + 1) * pageSize), [sortedReferrers, page, pageSize]);

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
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-focus bg-primary-subtle px-2.5 py-0.5 text-xs font-semibold text-primary">
            <Users2 size={13} aria-hidden="true" />
            Student Referral Rewards
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">{t('TITLE')}</h1>
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">{t('SUBTITLE')}</p>
      </div>

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

      <AdminFinanceReferralsKpiCards
        totalReferrals={totalReferrals}
        totalBonus={totalBonus}
        topReferrer={topReferrer}
        timeRangeLabel={timeRangeLabel}
        activeCount={filteredReferrers.length}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" aria-hidden="true" />
            <input
              maxLength={100}
              type="text"
              placeholder="Search referrer or student name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="min-h-11 w-full rounded-md border border-border bg-input pl-9 pr-3 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          {(search.trim() !== '' || timeRange !== 'this_month' || sortField !== null) && (
            <button
              type="button"
              onClick={() => { setSearch(''); setTimeRange('this_month'); setSortField(null); setPage(0); }}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover self-start sm:self-auto"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => exportReferralsCsv(filteredReferrers, selectedBranch?.name ?? 'Downtown Central')}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
            title="Export leaderboard to CSV"
          >
            <Download size={14} className="text-primary" aria-hidden="true" />
            <span>CSV</span>
          </button>
          <button
            type="button"
            onClick={() => exportReferralsExcel(filteredReferrers, selectedBranch?.name ?? 'Downtown Central')}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
            title="Export leaderboard to Excel (.xls)"
          >
            <FileSpreadsheet size={14} className="text-success-text" aria-hidden="true" />
            <span>Excel (.xls)</span>
          </button>
          <button
            type="button"
            onClick={() => printReferralsLeaderboard(filteredReferrers, selectedBranch ? selectedBranch.name : 'All Branches', timeRangeLabel)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
            title="Print referral leaderboard summary"
          >
            <Printer size={14} className="text-info-text" aria-hidden="true" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <AdminFinanceReferralsTable
        paginatedReferrers={paginatedReferrers}
        filteredCount={filteredReferrers.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(newSize: number) => { setPageSize(newSize); setPage(0); }}
        isLoading={isLoading}
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        expandedId={expanded}
        onToggleExpand={setExpanded}
        onRedeem={(ref) => setRedeemTarget(ref)}
        onViewVoucher={handleViewVoucher}
      />

      <AdminFinanceReferralsRedeemModal referrer={redeemTarget} isOpen={Boolean(redeemTarget)} onClose={() => setRedeemTarget(null)} onConfirmRedeem={handleConfirmRedeem} />
      <AdminFinanceReferralPayoutVoucherModal voucher={activeVoucher} isOpen={Boolean(activeVoucher)} onClose={() => setActiveVoucher(null)} />
    </div>
  );
}

export default AdminFinanceReferralsPage;
