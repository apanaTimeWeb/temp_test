'use client';
// Responsibility: Presentational table for Admin Finance Referrals ranking, sorting, and pagination.

import { useTranslations } from 'next-intl';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_referrals/utils/AdminFinanceReferralsFormat';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import type { AdminFinanceDemoReferrer } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';

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
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
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
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={`skeleton-${i + 1}`} className="h-12 border-b border-border text-text-primary">
                {Array.from({ length: 7 }).map((_, j) => (
                  <td key={`skeleton-cell-${j + 1}`} className="py-3 px-4">
                    <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-16" />
                  </td>
                ))}
              </tr>
            ))
          ) : filteredCount === 0 ? (
            <tr>
              <td colSpan={7}>
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
                    <span className={globalIndex === 0 ? 'text-warning-text font-bold' : 'text-text-secondary'}>#{globalIndex + 1}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-body font-semibold text-text-primary">{r.name}</div>
                    <div className="text-caption text-text-secondary">{r.smartId}</div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      data-testid={`admin_finance-referral-expand-${r.id}`}
                      aria-expanded={isExpanded}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer"
                      onClick={() => onToggleExpand(isExpanded ? null : r.id)}
                    >
                      {isExpanded ? '▲' : '▼'} {t(isExpanded ? 'COLLAPSE_STUDENTS' : 'EXPAND_STUDENTS')} ({r.referredNames.length})
                    </button>
                    {isExpanded && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {r.referredNames.map((name: string) => (
                          <span data-testid="admin_finance-page-state-005" key={name} className="inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-card text-text-secondary border-border">
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-body text-text-primary">{r.referredNames.length}</td>
                  <td className="py-3 px-4 text-right text-success-text">{formatAdminFinanceCurrency(r.bonusEarned)}</td>
                  <td className="py-3 px-4 text-right text-body text-text-primary">{formatAdminFinanceCurrency(r.redeemed)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-body text-text-primary">{formatAdminFinanceCurrency(r.balance)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {filteredCount > 0 && (
        <AdminTablePagination
          page={page}
          pageSize={pageSize}
          totalCount={filteredCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}

