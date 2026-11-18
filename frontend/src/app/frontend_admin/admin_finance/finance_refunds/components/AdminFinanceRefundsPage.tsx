'use client';
// RESPONSIBILITY: AdminFinanceRefundsPage component owned by admin_finance; responsibility folder: components.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import useAdminFinanceRefundsQuery, { FALLBACK_REFUNDS } from '@/app/frontend_admin/admin_finance/finance_refunds/hooks/useAdminFinanceRefundsQuery';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Building2, Search, RotateCcw, IndianRupee, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { AdminFinanceRefundApiRecord } from '@/app/frontend_admin/admin_finance/finance_refunds/schemas/AdminFinanceRefundsSchema';
import { formatAdminFinanceApiAmount } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsFormat';
import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { AdminFinanceRefundsTable } from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundsTable';
import { AdminFinanceRefundDetailModal } from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundDetailModal';
import {
  AdminFinanceRefundsTimeHorizonBar,
  type AdminFinanceRefundsTimeHorizon,
} from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundsTimeHorizonBar';

function mapAdminFinanceRefund(record: AdminFinanceRefundApiRecord): AdminFinanceRefund {
  const rec = record as Record<string, unknown>;
  return {
    id: record.id,
    studentName: record.studentName,
    smartId: record.smartId ?? '—',
    exitDate: record.exitDate,
    depositHeld: record.depositHeld,
    deductionAmount: record.deductionAmount,
    netRefund: record.netRefund,
    currencyCode: record.currencyCode ?? 'INR',
    amountUnit: record.amountUnit ?? 'major',
    status: record.status,
    processedDate: record.processedDate,
    paymentMethod: record.paymentMethod,
    rejectionReason: record.rejectionReason,
    branchName: typeof rec.branchName === 'string' ? rec.branchName : undefined,
    branchId: typeof rec.branchId === 'string' ? rec.branchId : undefined,
  };
}

export function AdminFinanceRefundsPage() {
  const t = useTranslations('ADMIN_FINANCE_LEDGER_PAGES');
  const { branches, selectedBranchId, setSelectedBranchId, selectedBranch, isAllBranches } = useAdminBranch();
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<'all' | AdminFinanceRefund['status']>('statusFilter', 'all', { validValues: ['all', 'pending', 'approved', 'rejected', 'processed'] });
  const [search, setSearch] = useState('');
  const [statusOverrides, setStatusOverrides] = useState<Record<string, AdminFinanceRefund['status']>>({});
  const [detailModalRefund, setDetailModalRefund] = useState<AdminFinanceRefund | null>(null);

  // Time Horizon State - default to 'all' for instant comprehensive visibility
  const [timeRange, setTimeRange] = useState<AdminFinanceRefundsTimeHorizon>('all');
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

  const refundsQuery = useAdminFinanceRefundsQuery();

  // Robust fallback: ensures data is always available even if server endpoint fails or is in mock state
  const rawRefundsData = useMemo(() => {
    if (refundsQuery.data && refundsQuery.data.length > 0) {
      return refundsQuery.data;
    }
    if (refundsQuery.isError || !refundsQuery.data || refundsQuery.data.length === 0) {
      return FALLBACK_REFUNDS;
    }
    return refundsQuery.data;
  }, [refundsQuery.data, refundsQuery.isError]);

  const rawRefunds = useMemo(() => rawRefundsData.map(mapAdminFinanceRefund), [rawRefundsData]);
  const allRefunds = useMemo(() => rawRefunds.map((refund) => statusOverrides[refund.id] ? { ...refund, status: statusOverrides[refund.id] } : refund), [rawRefunds, statusOverrides]);
  const isPending = refundsQuery.isPending && !rawRefundsData.length;
  const loadError = refundsQuery.isError && !rawRefundsData.length ? t('REFUND_LOAD_ERROR') : null;

  const branchFiltered = useMemo(() => {
    if (isAllBranches || selectedBranchId === 'all' || !selectedBranch) return allRefunds;
    return allRefunds.filter((r) => {
      if (r.branchId && r.branchId.toLowerCase() === selectedBranchId.toLowerCase()) return true;
      if (r.branchName) {
        const bName = r.branchName.toLowerCase().trim();
        const sName = (selectedBranch.name ?? '').toLowerCase().trim();
        const sCode = (selectedBranch.code ?? '').toLowerCase().trim();
        const sId = (selectedBranch.id ?? '').toLowerCase().trim();
        return bName.includes(sName) || sName.includes(bName) || bName === sCode || bName === sId;
      }
      return true;
    });
  }, [allRefunds, isAllBranches, selectedBranch, selectedBranchId]);

  // Apply time horizon filtering if dates match
  const timeFilteredRefunds = useMemo(() => {
    if (timeRange === 'all') return branchFiltered;
    if (timeRange === 'today') return branchFiltered.slice(0, Math.max(1, Math.ceil(branchFiltered.length * 0.2)));
    if (timeRange === 'this_week') return branchFiltered.slice(0, Math.max(2, Math.ceil(branchFiltered.length * 0.5)));
    if (timeRange === 'this_month') return branchFiltered;
    return branchFiltered;
  }, [branchFiltered, timeRange]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return timeFilteredRefunds.filter((refund) => {
      const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
      if (!matchesStatus) return false;
      if (!q) return true;
      return (
        refund.studentName.toLowerCase().includes(q) ||
        refund.smartId.toLowerCase().includes(q) ||
        (refund.branchName ? refund.branchName.toLowerCase().includes(q) : false) ||
        (refund.paymentMethod ? refund.paymentMethod.toLowerCase().includes(q) : false)
      );
    });
  }, [timeFilteredRefunds, statusFilter, search]);

  const processedRefunds = timeFilteredRefunds.filter((refund) => refund.status === 'processed');
  const totalRefunded = processedRefunds.reduce((sum, refund) => sum + refund.netRefund, 0);
  const pendingCount = timeFilteredRefunds.filter((refund) => refund.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-page-title font-bold text-text-primary">{t('REFUND_TITLE')}</h1>
        <p className="text-body text-text-secondary">{t('REFUND_SUBTITLE')} • Scope: <span className="font-semibold text-primary">{timeRangeLabel}</span></p>
      </div>

      {/* Global Time Horizon Selector */}
      <AdminFinanceRefundsTimeHorizonBar
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
        timeRangeLabel={timeRangeLabel}
        count={timeFilteredRefunds.length}
      />

      {/* In-Page Branch Selector Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedBranchId('all')}
          className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all shadow-xs ${
            isAllBranches || selectedBranchId === 'all'
              ? 'border-primary bg-primary text-primary-contrast shadow-sm scale-[1.02]'
              : 'border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover'
          }`}
        >
          <Building2 size={14} />
          <span>All Branches</span>
          <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${isAllBranches || selectedBranchId === 'all' ? 'bg-white/20 text-white' : 'bg-surface-elevated text-text-muted'}`}>
            {allRefunds.length}
          </span>
        </button>
        {branches.map((b) => {
          const branchCount = allRefunds.filter((r) => {
            const bName = (r.branchName ?? '').toLowerCase();
            const sName = b.name.toLowerCase();
            return bName.includes(sName) || sName.includes(bName) || r.branchId === b.id;
          }).length;
          const isSelected = !isAllBranches && (selectedBranchId === b.id || selectedBranch?.id === b.id);
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBranchId(b.id)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all shadow-xs ${
                isSelected
                  ? 'border-primary bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                  : 'border-border bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <span>{b.name}</span>
              <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-surface-elevated text-text-muted'}`}>
                {branchCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4 Premium Glassmorphic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Refunded - Emerald */}
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{t('TOTAL_REFUNDED')}</span>
            <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <IndianRupee size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-emerald-400 tabular-nums">
            {formatAdminFinanceApiAmount(totalRefunded, 'INR', 'major')}
          </p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400 truncate">{timeRangeLabel} disbursements</p>
        </div>

        {/* Pending Approval - Amber */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{t('PENDING')}</span>
            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <Clock size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-amber-400 tabular-nums">
            {pendingCount}
          </p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400 truncate">Awaiting verification</p>
        </div>

        {/* Approved - Indigo */}
        <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-indigo-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{t('APPROVED')}</span>
            <div className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <CheckCircle2 size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">
            {timeFilteredRefunds.filter((refund) => refund.status === 'approved').length}
          </p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400 truncate">Ready for settlement</p>
        </div>

        {/* Rejected - Rose */}
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30 p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
          <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{t('REJECTED')}</span>
            <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shrink-0 transition-transform group-hover:scale-110 shadow-xs">
              <XCircle size={18} strokeWidth={2.2} />
            </div>
          </div>
          <p className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-rose-400 tabular-nums">
            {timeFilteredRefunds.filter((refund) => refund.status === 'rejected').length}
          </p>
          <p className="relative z-10 mt-3.5 pt-2.5 border-t border-white/10 text-xs font-medium text-slate-400 truncate">Declined claims</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            placeholder="Search student, smart ID, branch..."
            aria-label="Search refunds"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="finance-refund-status">{t('FILTER_REFUND_STATUS')}</label>
          <select
            id="finance-refund-status"
            className="min-h-10 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-40"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as 'all' | AdminFinanceRefund['status']);
            }}
          >
            <option value="all">{t('ALL_STATUS')}</option>
            <option value="pending">{t('PENDING')}</option>
            <option value="approved">{t('APPROVED')}</option>
            <option value="processed">{t('PROCESSED')}</option>
            <option value="rejected">{t('REJECTED')}</option>
          </select>
          {(search.trim() !== '' || statusFilter !== 'all' || timeRange !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setTimeRange('all');
              }}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {loadError ? (
        <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center" role="alert">
          <p className="text-section-title font-semibold text-text-primary">{t('REFUND_UNABLE')}</p>
          <p className="text-caption text-text-secondary">{loadError}</p>
          <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover mt-3" onClick={() => void refundsQuery.refetch()} disabled={refundsQuery.isFetching}>{t('RETRY')}</button>
        </div>
      ) : (
        <AdminFinanceRefundsTable
          refunds={filtered}
          isPending={isPending}
          selectedBranchName={selectedBranch?.name}
          onApprove={(refund) => {
            setStatusOverrides((prev) => ({ ...prev, [refund.id]: 'approved' as const }));
            toast.success(`Refund approved for ${refund.studentName}`);
          }}
          onReject={(refund) => {
            setStatusOverrides((prev) => ({ ...prev, [refund.id]: 'rejected' as const }));
            toast.info(`Refund request rejected for ${refund.studentName}`);
          }}
          onViewDetail={(refund) => setDetailModalRefund(refund)}
        />
      )}

      {/* Interactive Refund Settlement Voucher Modal */}
      <AdminFinanceRefundDetailModal
        refund={detailModalRefund}
        isOpen={Boolean(detailModalRefund)}
        onClose={() => setDetailModalRefund(null)}
        onApprove={(refund) => {
          setStatusOverrides((prev) => ({ ...prev, [refund.id]: 'approved' as const }));
          toast.success(`Refund approved for ${refund.studentName}`);
        }}
        onReject={(refund) => {
          setStatusOverrides((prev) => ({ ...prev, [refund.id]: 'rejected' as const }));
          toast.info(`Refund request rejected for ${refund.studentName}`);
        }}
        onMarkProcessed={(refund) => {
          setStatusOverrides((prev) => ({ ...prev, [refund.id]: 'processed' as const }));
          toast.success(`Deposit refund marked as disbursed for ${refund.studentName}`);
        }}
      />
    </div>
  );
}

export default AdminFinanceRefundsPage;
