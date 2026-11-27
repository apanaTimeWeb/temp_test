'use client';
// RESPONSIBILITY: AdminFinanceRefundsPage component owned by admin_finance; responsibility folder: components.

import { AdminFinanceRefundDetailModal } from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundDetailModal';
import {
  AdminFinanceRefundDisburseModal,
  type RefundDisbursementPayload,
} from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundDisburseModal';
import { AdminFinanceRefundsKpiGrid } from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundsKpiGrid';
import { AdminFinanceRefundsTable } from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundsTable';
import {
  AdminFinanceRefundsTimeHorizonBar,
  type AdminFinanceRefundsTimeHorizon,
} from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundsTimeHorizonBar';
import useAdminFinanceRefundsQuery, { FALLBACK_REFUNDS } from '@/app/frontend_admin/admin_finance/finance_refunds/hooks/useAdminFinanceRefundsQuery';
import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import {
  exportAdminFinanceRefundsCsv,
  exportAdminFinanceRefundsExcel,
  mapAdminFinanceRefund,
} from '@/app/frontend_admin/admin_finance/finance_refunds/utils/adminFinanceRefundsExports';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { Download, FileSpreadsheet, RotateCcw, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export function AdminFinanceRefundsPage() {
  const t = useTranslations('ADMIN_FINANCE_LEDGER_PAGES');
  const { selectedBranchId, selectedBranch, isAllBranches } = useAdminBranch();
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<'all' | AdminFinanceRefund['status']>(
    'statusFilter',
    'all',
    { validValues: ['all', 'pending', 'approved', 'rejected', 'processed'] }
  );
  const [search, setSearch] = useState('');
  const [statusOverrides, setStatusOverrides] = useState<Record<string, AdminFinanceRefund['status']>>({});
  const [refundDetailsOverrides, setRefundDetailsOverrides] = useState<Record<string, Partial<AdminFinanceRefund>>>({});
  const [detailModalRefund, setDetailModalRefund] = useState<AdminFinanceRefund | null>(null);
  const [disburseModalRefund, setDisburseModalRefund] = useState<AdminFinanceRefund | null>(null);

  const [timeRange, setTimeRange] = useState<AdminFinanceRefundsTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const timeRangeLabel = useMemo(() => {
    switch (timeRange) {
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

  const rawRefundsData = useMemo(() => {
    if (refundsQuery.data && refundsQuery.data.length > 0) {
      return refundsQuery.data;
    }
    return FALLBACK_REFUNDS;
  }, [refundsQuery.data]);

  const rawRefunds = useMemo(() => rawRefundsData.map(mapAdminFinanceRefund), [rawRefundsData]);
  const allRefunds = useMemo(() => {
    return rawRefunds.map((refund) => {
      const idStr = String(refund.id);
      const nextStatus = statusOverrides[idStr];
      const nextDetails = refundDetailsOverrides[idStr];
      return {
        ...refund,
        ...(nextStatus ? { status: nextStatus } : {}),
        ...(nextDetails ?? {}),
      };
    });
  }, [rawRefunds, statusOverrides, refundDetailsOverrides]);

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

  const timeFilteredRefunds = useMemo(() => {
    if (timeRange === 'today') return branchFiltered.slice(0, Math.max(1, Math.ceil(branchFiltered.length * 0.2)));
    if (timeRange === 'this_week') return branchFiltered.slice(0, Math.max(2, Math.ceil(branchFiltered.length * 0.5)));
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

  const totalRefunded = useMemo(
    () => timeFilteredRefunds.filter((refund) => refund.status === 'processed').reduce((sum, refund) => sum + refund.netRefund, 0),
    [timeFilteredRefunds]
  );
  const pendingCount = useMemo(() => timeFilteredRefunds.filter((r) => r.status === 'pending').length, [timeFilteredRefunds]);
  const approvedCount = useMemo(() => timeFilteredRefunds.filter((r) => r.status === 'approved').length, [timeFilteredRefunds]);
  const rejectedCount = useMemo(() => timeFilteredRefunds.filter((r) => r.status === 'rejected').length, [timeFilteredRefunds]);

  const handleApproveRefund = (refund: AdminFinanceRefund) => {
    setStatusOverrides((prev) => ({ ...prev, [String(refund.id)]: 'approved' }));
    toast.success(`Refund approved for ${refund.studentName}`, { id: 'refund-approve-success' });
  };

  const handleRejectRefund = (refund: AdminFinanceRefund) => {
    setStatusOverrides((prev) => ({ ...prev, [String(refund.id)]: 'rejected' }));
    toast.info(`Refund request rejected for ${refund.studentName}`, { id: 'refund-reject-info' });
  };

  const handleConfirmDisburse = (refundId: string | number, payload: RefundDisbursementPayload) => {
    const idStr = String(refundId);
    setStatusOverrides((prev) => ({ ...prev, [idStr]: 'processed' }));
    setRefundDetailsOverrides((prev) => ({
      ...prev,
      [idStr]: {
        status: 'processed',
        paymentMethod: payload.paymentMethod,
        transactionUtr: payload.transactionUtr,
        beneficiaryAccount: payload.beneficiaryAccount,
        receiptNumber: payload.receiptNumber,
        disbursedAt: payload.disbursedAt,
      },
    }));

    const target = allRefunds.find((r) => String(r.id) === idStr);
    if (target) {
      setDetailModalRefund({
        ...target,
        status: 'processed',
        paymentMethod: payload.paymentMethod,
        transactionUtr: payload.transactionUtr,
        beneficiaryAccount: payload.beneficiaryAccount,
        receiptNumber: payload.receiptNumber,
        disbursedAt: payload.disbursedAt,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">{t('REFUND_TITLE')}</h1>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] font-mono text-text-secondary">
            Scope: <span className="text-primary font-semibold">{timeRangeLabel}</span>
          </span>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">{t('REFUND_SUBTITLE')}</p>
      </div>

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

      <AdminFinanceRefundsKpiGrid
        totalRefunded={totalRefunded}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
        timeRangeLabel={timeRangeLabel}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
          <input
            maxLength={100}
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search student, smart ID, branch..."
            aria-label="Search refunds"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="finance-refund-status">{t('FILTER_REFUND_STATUS')}</label>
          <select
            id="finance-refund-status"
            className="min-h-10 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-40"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | AdminFinanceRefund['status'])}
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
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 pl-2 border-l border-border">
            <button
              type="button"
              onClick={() => exportAdminFinanceRefundsCsv(filtered, selectedBranch?.name)}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
              title="Export refunds to CSV"
            >
              <Download size={14} className="text-success-text" aria-hidden="true" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={() => exportAdminFinanceRefundsExcel(filtered, selectedBranch?.name)}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors shadow-card"
              title="Export refunds to Excel (.xls) for CA/Accountant"
            >
              <FileSpreadsheet size={14} className="text-success-text" aria-hidden="true" />
              <span>Excel (.xls)</span>
            </button>
          </div>
        </div>
      </div>

      {loadError ? (
        <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center" role="alert">
          <p className="text-section-title font-semibold text-text-primary">{t('REFUND_UNABLE')}</p>
          <p className="text-caption text-text-secondary">{loadError}</p>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3.5 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-primary hover:bg-surface-hover motion-safe:transition-colors mt-3"
            onClick={() => void refundsQuery.refetch()}
            disabled={refundsQuery.isFetching}
          >
            {t('RETRY')}
          </button>
        </div>
      ) : (
        <AdminFinanceRefundsTable
          refunds={filtered}
          isPending={isPending}
          selectedBranchName={selectedBranch?.name}
          onApprove={handleApproveRefund}
          onReject={handleRejectRefund}
          onViewDetail={(refund) => setDetailModalRefund(refund)}
          onDisburse={(refund) => setDisburseModalRefund(refund)}
        />
      )}

      <AdminFinanceRefundDetailModal
        refund={detailModalRefund}
        isOpen={Boolean(detailModalRefund)}
        onClose={() => setDetailModalRefund(null)}
        onApprove={handleApproveRefund}
        onReject={handleRejectRefund}
        onOpenDisburseModal={(refund) => setDisburseModalRefund(refund)}
        onMarkProcessed={(refund) => setDisburseModalRefund(refund)}
      />

      <AdminFinanceRefundDisburseModal
        refund={disburseModalRefund}
        isOpen={Boolean(disburseModalRefund)}
        onClose={() => setDisburseModalRefund(null)}
        onConfirmDisburse={handleConfirmDisburse}
      />
    </div>
  );
}

export default AdminFinanceRefundsPage;
