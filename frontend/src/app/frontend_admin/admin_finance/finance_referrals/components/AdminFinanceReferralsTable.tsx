'use client';
// Responsibility: Presentational table for Admin Finance Referrals ranking, sorting, and pagination.

import type { AdminFinanceDemoReferrer } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';
import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_referrals/utils/AdminFinanceReferralsFormat';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, IndianRupee, Receipt } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type ReferralsSortField = 'name' | 'referredCount' | 'bonusEarned' | 'redeemed' | 'balance';

interface AdminFinanceReferralsTableProps {
  paginatedReferrers: AdminFinanceDemoReferrer[];
  filteredCount: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  isLoading: boolean;
  sortField: ReferralsSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: ReferralsSortField) => void;
  expandedId: number | null;
  onToggleExpand: (id: number | null) => void;
  onRedeem?: (referrer: AdminFinanceDemoReferrer) => void;
  onViewVoucher?: (referrer: AdminFinanceDemoReferrer) => void;
}

export function AdminFinanceReferralsTable({
  paginatedReferrers,
  filteredCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading,
  sortField,
  sortDirection,
  onToggleSort,
  expandedId,
  onToggleExpand,
  onRedeem,
  onViewVoucher,
}: AdminFinanceReferralsTableProps) {
  const t = useTranslations('ADMIN_FINANCE_REFERRALS');

  const renderSortableHeader = (field: ReferralsSortField, label: string, align: 'left' | 'right' | 'center' = 'left') => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`py-3 px-4 whitespace-nowrap ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}
      >
        <button
          type="button"
          onClick={() => onToggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${align === 'right' ? 'ml-auto' : align === 'center' ? 'mx-auto' : ''}`}
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 motion-safe:transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
            <th className="text-left py-3 px-4">{t('RANK')}</th>
            {renderSortableHeader('name', t('REFERRER'))}
            <th className="text-left py-3 px-4">{t('REFERRED_STUDENTS')}</th>
            {renderSortableHeader('referredCount', t('REFERRED_COUNT'), 'center')}
            {renderSortableHeader('bonusEarned', t('BONUS_EARNED'), 'right')}
            {renderSortableHeader('redeemed', t('REDEEMED'), 'right')}
            {renderSortableHeader('balance', t('BALANCE'), 'right')}
            <th className="text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={`skeleton-${i + 1}`} className="h-12 border-b border-border text-text-primary">
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={`skeleton-cell-${j + 1}`} className="py-3 px-4">
                    <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-16" />
                  </td>
                ))}
              </tr>
            ))
          ) : filteredCount === 0 ? (
            <tr>
              <td colSpan={8}>
                <div data-testid="admin_finance-page-state-001" className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center">
                  <div data-testid="admin_finance-page-state-002" className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary">👥</div>
                  <p data-testid="admin_finance-page-state-003" className="text-section-title font-semibold text-text-primary">{t('EMPTY')}</p>
                </div>
              </td>
            </tr>
          ) : (
            paginatedReferrers.map((r, idx) => {
              const globalIndex = page * pageSize + idx;
              const isExpanded = expandedId === r.id;
              return (
                <tr key={r.id} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                      globalIndex === 0
                        ? 'bg-warning-bg text-warning-text border border-warning'
                        : globalIndex <= 2
                          ? 'bg-surface-highlight text-text-primary border border-border'
                          : 'text-text-secondary font-mono'
                    }`}>
                      #{globalIndex + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-body font-semibold text-text-primary">{r.name}</div>
                    <div className="text-caption text-text-secondary font-mono">{r.smartId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      data-testid={`admin_finance-referral-expand-${r.id}`}
                      aria-expanded={isExpanded}
                      className="inline-flex min-h-8 min-w-8 items-center justify-center gap-1.5 rounded-lg border border-border-focus bg-primary-subtle px-2.5 py-1 text-xs font-semibold text-primary hover:opacity-90 motion-safe:transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      onClick={() => onToggleExpand(isExpanded ? null : r.id)}
                    >
                      {isExpanded ? '▲' : '▼'} {t(isExpanded ? 'COLLAPSE_STUDENTS' : 'EXPAND_STUDENTS')} ({r.referredNames.length})
                    </button>
                    {isExpanded && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {r.referredNames.map((name: string) => (
                          <span data-testid="admin_finance-page-state-005" key={name} className="inline-flex min-h-6 items-center gap-1 rounded-full border border-border-focus bg-primary-subtle px-2.5 py-0.5 text-badge font-semibold capitalize whitespace-nowrap text-primary">
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-body text-text-primary font-mono">{r.referredNames.length}</td>
                  <td className="py-3 px-4 text-right text-success-text font-bold font-mono">{formatAdminFinanceCurrency(r.bonusEarned)}</td>
                  <td className="py-3 px-4 text-right text-body text-text-primary font-mono">{formatAdminFinanceCurrency(r.redeemed)}</td>
                  <td className="py-3 px-4 text-right font-bold text-body text-text-primary font-mono">{formatAdminFinanceCurrency(r.balance)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      {r.redeemed > 0 && onViewVoucher && (
                        <button
                          type="button"
                          onClick={() => onViewVoucher(r)}
                          className="inline-flex items-center gap-1 rounded-md border border-border-focus bg-primary-subtle hover:opacity-90 px-2 py-1 text-xs font-semibold text-primary motion-safe:transition-opacity shadow-card"
                          title="View & Print Payout Voucher / Credit Note"
                          aria-label={`View payout voucher for ${r.name}`}
                        >
                          <Receipt size={12} strokeWidth={2} aria-hidden="true" />
                          <span>Voucher</span>
                        </button>
                      )}
                      {r.balance > 0 ? (
                        <button
                          type="button"
                          onClick={() => onRedeem?.(r)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-success bg-success-bg hover:opacity-90 px-2.5 py-1 text-xs font-semibold text-success-text motion-safe:transition-opacity shadow-card"
                          title="Disburse / Redeem Referral Bonus"
                          aria-label={`Redeem referral bonus for ${r.name}`}
                        >
                          <IndianRupee size={12} strokeWidth={2.5} aria-hidden="true" />
                          <span>Redeem</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-highlight px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                          <CheckCircle2 size={11} className="text-success-text" aria-hidden="true" /> Settled
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {filteredCount > 0 && (
        <AdminTablePagination page={page} pageSize={pageSize} totalCount={filteredCount} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
      )}
    </div>
  );
}
