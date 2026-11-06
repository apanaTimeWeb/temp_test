'use client';
// RESPONSIBILITY: AdminFinanceRefundsPage component owned by admin_finance; responsibility folder: components.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import useAdminFinanceRefundsQuery from '@/app/frontend_admin/admin_finance/finance_refunds/hooks/useAdminFinanceRefundsQuery';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Building2, Search } from 'lucide-react';
import type { AdminFinanceRefundApiRecord } from '@/app/frontend_admin/admin_finance/finance_refunds/schemas/AdminFinanceRefundsSchema';
import { formatAdminFinanceApiAmount } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsFormat';
import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { ALL_BRANCHES_ID } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBranchConstants';
import { AdminFinanceRefundsTable } from '@/app/frontend_admin/admin_finance/finance_refunds/components/AdminFinanceRefundsTable';

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
    currencyCode: record.currencyCode,
    amountUnit: record.amountUnit,
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
  const { branches, selectedBranchId, selectedBranch, setSelectedBranchId, isAllBranches } = useAdminBranch();
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<'all' | AdminFinanceRefund['status']>('statusFilter', 'all', { validValues: ['all', 'pending', 'approved', 'rejected', 'processed'] });
  const [search, setSearch] = useState('');
  const [statusOverrides, setStatusOverrides] = useState<Record<string, AdminFinanceRefund['status']>>({});

  const refundsQuery = useAdminFinanceRefundsQuery();
  const rawRefunds = useMemo(() => (refundsQuery.data ?? []).map(mapAdminFinanceRefund), [refundsQuery.data]);
  const allRefunds = useMemo(() => rawRefunds.map((refund) => statusOverrides[refund.id] ? { ...refund, status: statusOverrides[refund.id] } : refund), [rawRefunds, statusOverrides]);
  const isPending = refundsQuery.isPending;
  const loadError = refundsQuery.isError ? t('REFUND_LOAD_ERROR') : null;

  const branchFiltered = useMemo(() => {
    if (isAllBranches || !selectedBranch) return allRefunds;
    return allRefunds.filter((r) => {
      if (r.branchId) return r.branchId.toLowerCase() === selectedBranchId.toLowerCase();
      if (r.branchName) return r.branchName.toLowerCase().includes(selectedBranch.name.toLowerCase()) || selectedBranch.name.toLowerCase().includes(r.branchName.toLowerCase());
      return false;
    });
  }, [allRefunds, isAllBranches, selectedBranch, selectedBranchId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return branchFiltered.filter((refund) => {
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
  }, [branchFiltered, statusFilter, search]);

  const processedRefunds = branchFiltered.filter((refund) => refund.status === 'processed');
  const totalRefunded = processedRefunds.reduce((sum, refund) => sum + refund.netRefund, 0);
  const firstProcessedRefund = processedRefunds[0];
  const hasSingleCurrencyUnit = Boolean(firstProcessedRefund?.currencyCode && firstProcessedRefund.amountUnit && processedRefunds.every((refund) => refund.currencyCode === firstProcessedRefund.currencyCode && refund.amountUnit === firstProcessedRefund.amountUnit));
  const pendingCount = branchFiltered.filter((refund) => refund.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title font-bold text-text-primary">{t('REFUND_TITLE')}</h1>
        <p className="mt-1 text-body text-text-secondary">{t('REFUND_SUBTITLE')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4"><p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">{t('TOTAL_REFUNDED')}</p><p className="mt-1 text-page-title font-bold text-text-primary text-success-text">{isPending || loadError ? '—' : formatAdminFinanceApiAmount(totalRefunded, hasSingleCurrencyUnit ? firstProcessedRefund?.currencyCode : undefined, hasSingleCurrencyUnit ? firstProcessedRefund?.amountUnit : undefined)}</p></div>
        <div className="rounded-lg border border-border bg-card p-4"><p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">{t('PENDING')}</p><p className="mt-1 text-page-title font-bold text-text-primary text-warning-text">{isPending || loadError ? '—' : pendingCount}</p></div>
        <div className="rounded-lg border border-border bg-card p-4"><p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">{t('APPROVED')}</p><p className="mt-1 text-page-title font-bold text-text-primary">{isPending || loadError ? '—' : branchFiltered.filter((refund) => refund.status === 'approved').length}</p></div>
        <div className="rounded-lg border border-border bg-card p-4"><p className="text-micro font-semibold uppercase tracking-wider text-text-secondary">{t('REJECTED')}</p><p className="mt-1 text-page-title font-bold text-text-primary text-danger-text">{isPending || loadError ? '—' : branchFiltered.filter((refund) => refund.status === 'rejected').length}</p></div>
      </div>

      {/* Multi-Branch Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            <Building2 size={14} className="text-primary shrink-0" />
            Branch:
          </span>
          <button
            type="button"
            onClick={() => setSelectedBranchId(ALL_BRANCHES_ID)}
            className={`min-h-8 rounded-full px-3 py-1 text-xs font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isAllBranches
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'bg-surface-highlight text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
          >
            All Branches
          </button>
          {branches.map((b) => {
            const isSelected = selectedBranchId === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBranchId(b.id)}
                className={`min-h-8 rounded-full px-3 py-1 text-xs font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isSelected
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'bg-surface-highlight text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`}
              >
                {b.name} {b.isMain ? '★' : ''}
              </button>
            );
          })}
        </div>
        {selectedBranch && (
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-highlight px-2.5 py-1 text-xs text-text-secondary">
            <span className="font-medium text-text-primary">{selectedBranch.name}</span>
            <span>({selectedBranch.code})</span>
          </span>
        )}
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
        />
      )}
    </div>
  );
}
export default AdminFinanceRefundsPage;
