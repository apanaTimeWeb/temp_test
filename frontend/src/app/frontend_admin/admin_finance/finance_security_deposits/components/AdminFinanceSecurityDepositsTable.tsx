// Responsibility: AdminFinanceSecurityDepositsTable component owned by admin_finance; responsibility folder: admin_finance_security_deposits_sections.
'use client';

// RESPONSIBILITY: Renders the security-deposit ledger and exposes intent callbacks for row actions.

import { Minus, Undo2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { AdminFinanceDeposit } from '@/app/frontend_admin/admin_finance/finance_security_deposits/types/AdminFinanceSecurityDepositsTypes';
import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_security_deposits/utils/AdminFinanceSecurityDepositsFormat';
import { displayValue } from '@/lib/display_value';
import type { AdminFinanceSecurityDepositsTableProps } from '@/app/frontend_admin/admin_finance/finance_security_deposits/types/AdminFinanceSecurityDepositsTypes';


const STATUS_BADGE: Record<AdminFinanceDeposit['status'], string> = {
  held: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-info-bg text-info-text border-info-bg',
  refunded: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-success-bg text-success-text border-success-bg',
  forfeited: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-danger-bg text-danger-text border-danger-bg',
};

export default function AdminFinanceSecurityDepositsTable({ deposits, isLoading, onProcessRefund, onAddDeduction, canMutate }: AdminFinanceSecurityDepositsTableProps) {
  const t = useTranslations('ADMIN_FINANCE_SECURITY_DEPOSITS');
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card overflow-x-auto" aria-label={t('LEDGER')}>
      <table className="w-full">
        <thead>
          <tr className="bg-surface-highlight text-caption text-text-secondary">
            <th className="px-4 py-3 text-left">{t('STUDENT')}</th>
            <th className="px-4 py-3 text-right">{t('DEPOSIT')}</th>
            <th className="px-4 py-3 text-left">{t('STATUS')}</th>
            <th className="px-4 py-3 text-left">{t('COLLECTED_BY')}</th>
            <th className="px-4 py-3 text-left">{t('COLLECTED_DATE')}</th>
            <th className="px-4 py-3 text-right">{t('DEDUCTION')}</th>
            <th className="px-4 py-3 text-left">{t('DEDUCTION_REASON')}</th>
            <th className="px-4 py-3 text-right">{t('REFUND_AMOUNT')}</th>
            <th className="px-4 py-3 text-left">{t('REFUNDED_DATE')}</th>
            <th className="px-4 py-3 text-right">{t('ACTIONS')}</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? Array.from({ length: 5 }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border text-text-primary">
              {Array.from({ length: 10 }).map((__, cellIndex) => <td key={cellIndex} className="px-4 py-3"><div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-16" /></td>)}
            </tr>
          )) : deposits.length === 0 ? (
            <tr><td colSpan={10}><div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary">💼</div><p className="text-section-title font-semibold text-text-primary">{t('EMPTY')}</p></div></td></tr>
          ) : deposits.map((deposit) => (
            <tr key={deposit.id} className="motion-safe:transition-colors hover:bg-primary-subtle border-b border-border text-text-primary">
              <td className="px-4 py-3"><div className="text-body font-semibold text-text-primary">{displayValue(deposit.studentName)}</div><div className="text-caption text-text-secondary">{displayValue(deposit.smartId)}</div></td>
              <td className="px-4 py-3 text-right font-semibold text-body text-text-primary">{formatAdminFinanceCurrency(deposit.depositAmount)}</td>
              <td className="px-4 py-3"><span className={STATUS_BADGE[deposit.status] ?? 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-card text-text-secondary border-border'}>{t(deposit.status === 'held' ? 'STATUS_HELD' : deposit.status === 'refunded' ? 'STATUS_REFUNDED' : 'STATUS_FORFEITED')}</span></td>
              <td className="px-4 py-3 text-body text-text-primary">{displayValue(deposit.collectedBy)}</td>
              <td className="px-4 py-3 text-caption text-text-secondary">{displayValue(deposit.collectedDate)}</td>
              <td className={`px-4 py-3 text-right ${deposit.deductionAmount > 0 ? 'text-danger-text' : 'text-text-secondary'}`}>{deposit.deductionAmount > 0 ? formatAdminFinanceCurrency(deposit.deductionAmount) : '—'}</td>
              <td className="px-4 py-3 text-caption text-text-secondary">{displayValue(deposit.deductionReason)}</td>
              <td className="px-4 py-3 text-right text-caption text-text-secondary">{deposit.refundAmount !== undefined ? formatAdminFinanceCurrency(deposit.refundAmount) : displayValue(deposit.refundAmount)}</td>
              <td className="px-4 py-3 text-caption text-text-secondary">{displayValue(deposit.refundedDate)}</td>
              <td className="px-4 py-3">
                {deposit.status === 'held' ? (
                  <div className="flex items-center justify-end gap-2">
                    <button type="button" data-testid="admin_finance-page-control-006" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-success-bg text-success-text border-success-bg cursor-pointer" disabled={!canMutate} title={!canMutate ? t('REFUND_BLOCKED') : undefined} onClick={() => onProcessRefund(deposit)}><Undo2 size={18} strokeWidth={2} /> {t('PROCESS_REFUND')}</button>
                    <button type="button" data-testid="admin_finance-page-control-007" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-warning-bg text-warning-text border-warning-bg cursor-pointer" disabled={!canMutate} title={!canMutate ? t('DEDUCTION_BLOCKED') : undefined} onClick={() => onAddDeduction(deposit)}><Minus size={18} strokeWidth={2} /> {t('ADD_DEDUCTION')}</button>
                  </div>
                ) : deposit.status === 'refunded' && deposit.refundedDate ? <span className="text-caption text-text-secondary">{t('REFUNDED_ON', { date: deposit.refundedDate })}</span> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}


export type { AdminFinanceSecurityDepositsTableProps };
