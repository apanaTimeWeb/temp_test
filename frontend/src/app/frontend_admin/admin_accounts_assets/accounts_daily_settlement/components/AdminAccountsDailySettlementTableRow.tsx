'use client';
// Responsibility: AdminAccountsDailySettlementTableRow component owned by accounts_daily_settlement.

import type { DailySettlementRecord } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import {
  formatPaiseToRupees,
  formatSettlementDate,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/AdminAccountsDailySettlementFormatters';
import { printDailySettlementVoucher } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/adminAccountsDailySettlementExports';
import { displayValue } from '@/lib/display_value';
import { AlertTriangle, Check, Clock, ExternalLink, Printer, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

export { printDailySettlementVoucher };

interface AdminAccountsDailySettlementTableRowProps {
  record: DailySettlementRecord;
  onApprove: (record: DailySettlementRecord) => void;
  onFlag: (record: DailySettlementRecord) => void;
}

export function AdminAccountsDailySettlementTableRow({
  record,
  onApprove,
  onFlag,
}: AdminAccountsDailySettlementTableRowProps) {
  const t = useTranslations('ADMIN_ACCOUNTS_DAILY_SETTLEMENT');
  const isShortage = record.difference < 0;
  const isSurplus = record.difference > 0;

  return (
    <tr className="hover:bg-surface-hover even:bg-surface-zebra motion-safe:transition-colors">
      <td className="px-4 py-3.5 whitespace-nowrap">
        <p className="font-medium text-text-primary">{formatSettlementDate(record.date)}</p>
        <p className="text-xs text-text-secondary">{record.shiftName}</p>
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        <p className="font-medium text-text-primary">{record.branchName}</p>
        {record.bankReferenceNumber ? (
          <p className="text-xs font-mono text-text-secondary">Ref: {record.bankReferenceNumber}</p>
        ) : (
          <p className="text-xs italic text-text-secondary">Direct Counter</p>
        )}
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        <p className="font-medium text-text-primary">{record.managerName}</p>
        {record.managerNotes && (
          <p className="text-xs text-text-secondary truncate max-w-[180px]" title={record.managerNotes}>
            {record.managerNotes}
          </p>
        )}
      </td>

      <td className="px-4 py-3.5 text-right font-mono text-text-primary whitespace-nowrap">
        {formatPaiseToRupees(record.openingCash)}
      </td>

      <td className="px-4 py-3.5 text-right whitespace-nowrap">
        <p className="font-mono font-medium text-text-primary">{formatPaiseToRupees(record.cashCollected)} (Cash)</p>
        <p className="font-mono text-xs text-text-secondary">{formatPaiseToRupees(record.upiCollected)} (UPI)</p>
      </td>

      <td className="px-4 py-3.5 text-right font-mono text-text-primary whitespace-nowrap">
        {formatPaiseToRupees(record.expensesPaid)}
      </td>

      <td className="px-4 py-3.5 text-right font-mono font-medium text-text-primary whitespace-nowrap">
        {formatPaiseToRupees(record.expectedClosingCash)}
      </td>

      <td className="px-4 py-3.5 text-right font-mono font-semibold text-text-primary whitespace-nowrap">
        {formatPaiseToRupees(record.actualHandoverCash)}
      </td>

      <td className="px-4 py-3.5 text-right font-mono whitespace-nowrap">
        {isShortage ? (
          <span className="inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-xs font-bold bg-danger-bg text-danger-text border border-danger">
            {formatPaiseToRupees(record.difference)}
          </span>
        ) : isSurplus ? (
          <span className="inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-xs font-bold bg-success-bg text-success-text border border-success">
            +{formatPaiseToRupees(record.difference)}
          </span>
        ) : (
          <span className="text-xs text-text-secondary">{formatPaiseToRupees(0)}</span>
        )}
      </td>

      <td className="px-4 py-3.5 text-center whitespace-nowrap">
        {record.status === 'PENDING_APPROVAL' && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-warning bg-warning-bg px-2.5 py-0.5 text-xs font-semibold text-warning-text">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>{t('STATUS.PENDING_APPROVAL')}</span>
          </span>
        )}
        {record.status === 'APPROVED' && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success bg-success-bg px-2.5 py-0.5 text-xs font-semibold text-success-text">
            <Check className="h-3 w-3" aria-hidden="true" />
            <span>{t('STATUS.APPROVED')}</span>
          </span>
        )}
        {record.status === 'DISCREPANCY_FLAGGED' && (
          <div className="flex flex-col items-center gap-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-danger bg-danger-bg px-2.5 py-0.5 text-xs font-semibold text-danger-text">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              <span>{t('STATUS.DISCREPANCY_FLAGGED')}</span>
            </span>
            {record.resolutionAction && (
              <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-surface-highlight text-text-primary border border-border shadow-card">
                {record.resolutionAction === 'DEDUCT_SALARY' && 'Deduct: Salary'}
                {record.resolutionAction === 'CARRY_FORWARD' && 'Carry Forward'}
                {record.resolutionAction === 'IMMEDIATE_DEPOSIT' && 'Paid On-Spot'}
                {record.resolutionAction === 'WRITE_OFF' && 'Waived / Loss'}
              </span>
            )}
          </div>
        )}
      </td>

      <td className="px-4 py-3.5 text-center whitespace-nowrap">
        <div className="inline-flex items-center justify-center gap-1.5">
          {record.status === 'PENDING_APPROVAL' && (
            <>
              <button
                type="button"
                onClick={() => onApprove(record)}
                title={t('ACTIONS.APPROVE_CLEAR')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-success hover:opacity-90 px-3 py-1.5 text-xs font-semibold text-on-primary shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success min-h-[32px] motion-safe:transition-transform motion-safe:hover:scale-[1.02]"
              >
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t('ACTIONS.APPROVE_CLEAR')}</span>
              </button>
              <button
                type="button"
                onClick={() => onFlag(record)}
                title={t('ACTIONS.FLAG_DISCREPANCY')}
                className="inline-flex items-center gap-1 rounded-lg border border-danger bg-danger-bg hover:opacity-90 px-2.5 py-1.5 text-xs font-semibold text-danger-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger min-h-[32px] motion-safe:transition-opacity"
              >
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{t('ACTIONS.FLAG_DISCREPANCY')}</span>
              </button>
            </>
          )}

          {record.status === 'DISCREPANCY_FLAGGED' && (
            <button
              type="button"
              onClick={() => onApprove(record)}
              title="Re-audit and Clear"
              className="inline-flex items-center gap-1.5 rounded-lg border border-warning bg-warning-bg hover:opacity-90 px-3 py-1.5 text-xs font-semibold text-warning-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning min-h-[32px] motion-safe:transition-opacity"
            >
              <Check className="h-3.5 w-3.5 text-warning-text" aria-hidden="true" />
              <span>Re-audit &amp; Clear</span>
            </button>
          )}

          {record.status === 'APPROVED' && (
            <span className="text-xs text-text-secondary flex items-center gap-1 font-medium">
              <Check className="h-3.5 w-3.5 text-success-text" aria-hidden="true" />
              <span>{displayValue(record.approvedBy ?? 'Approved')}</span>
            </span>
          )}

          {record.bankDepositSlipUrl && (
            <a
              href={record.bankDepositSlipUrl}
              target="_blank"
              rel="noreferrer"
              title={t('ACTIONS.VIEW_SLIP')}
              className="inline-flex items-center justify-center p-1.5 rounded-md text-primary hover:bg-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[32px] min-w-[32px]"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}

          <button
            type="button"
            onClick={() => printDailySettlementVoucher(record)}
            title="Print Cash Handover Voucher"
            aria-label={`Print settlement voucher for ${record.branchName} on ${record.date}`}
            className="inline-flex items-center justify-center p-1.5 rounded-md border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface-hover min-h-[32px] min-w-[32px] motion-safe:transition-colors"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default AdminAccountsDailySettlementTableRow;
