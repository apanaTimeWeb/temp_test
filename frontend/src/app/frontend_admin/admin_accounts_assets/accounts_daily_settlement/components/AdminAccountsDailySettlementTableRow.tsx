'use client';
// Responsibility: AdminAccountsDailySettlementTableRow component owned by accounts_daily_settlement.

import { Check, AlertTriangle, Clock, ExternalLink, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { DailySettlementRecord } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import {
  formatPaiseToRupees,
  formatSettlementDate,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/AdminAccountsDailySettlementFormatters';
import { displayValue } from '@/lib/display_value';

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
    <tr className="hover:bg-muted-hover motion-safe:transition-colors focus-within:bg-muted">
      {/* Date & Shift */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <p className="font-medium text-foreground">{formatSettlementDate(record.date)}</p>
        <p className="text-xs text-muted-foreground">{record.shiftName}</p>
      </td>

      {/* Branch */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <p className="font-medium text-foreground">{record.branchName}</p>
        {record.bankReferenceNumber ? (
          <p className="text-xs font-mono text-muted-foreground">Ref: {record.bankReferenceNumber}</p>
        ) : (
          <p className="text-xs italic text-muted-foreground">Direct Counter</p>
        )}
      </td>

      {/* Manager */}
      <td className="px-4 py-3.5 whitespace-nowrap">
        <p className="font-medium text-foreground">{record.managerName}</p>
        {record.managerNotes && (
          <p className="text-xs text-muted-foreground truncate max-w-[180px]" title={record.managerNotes}>
            {record.managerNotes}
          </p>
        )}
      </td>

      {/* Opening Cash */}
      <td className="px-4 py-3.5 text-right font-mono text-foreground whitespace-nowrap">
        {formatPaiseToRupees(record.openingCash)}
      </td>

      {/* Collections */}
      <td className="px-4 py-3.5 text-right whitespace-nowrap">
        <p className="font-mono font-medium text-foreground">{formatPaiseToRupees(record.cashCollected)} (Cash)</p>
        <p className="font-mono text-xs text-muted-foreground">{formatPaiseToRupees(record.upiCollected)} (UPI)</p>
      </td>

      {/* Expenses Paid */}
      <td className="px-4 py-3.5 text-right font-mono text-foreground whitespace-nowrap">
        {formatPaiseToRupees(record.expensesPaid)}
      </td>

      {/* Expected Closing Cash */}
      <td className="px-4 py-3.5 text-right font-mono font-medium text-foreground whitespace-nowrap">
        {formatPaiseToRupees(record.expectedClosingCash)}
      </td>

      {/* Actual Handover */}
      <td className="px-4 py-3.5 text-right font-mono font-semibold text-foreground whitespace-nowrap">
        {formatPaiseToRupees(record.actualHandoverCash)}
      </td>

      {/* Variance */}
      <td className="px-4 py-3.5 text-right font-mono whitespace-nowrap">
        {isShortage ? (
          <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-semibold bg-destructive-bg text-destructive">
            {formatPaiseToRupees(record.difference)}
          </span>
        ) : isSurplus ? (
          <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-semibold bg-success-bg text-success-text">
            +{formatPaiseToRupees(record.difference)}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">₹0.00</span>
        )}
      </td>

      {/* Status Badge */}
      <td className="px-4 py-3.5 text-center whitespace-nowrap">
        {record.status === 'PENDING_APPROVAL' && (
          <span className="inline-flex items-center gap-1 rounded-full border border-warning-bg bg-warning-bg px-2.5 py-0.5 text-xs font-medium text-warning-text">
            <Clock className="h-3 w-3" />
            <span>{t('STATUS.PENDING_APPROVAL')}</span>
          </span>
        )}
        {record.status === 'APPROVED' && (
          <span className="inline-flex items-center gap-1 rounded-full border border-success-bg bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success-text">
            <Check className="h-3 w-3" />
            <span>{t('STATUS.APPROVED')}</span>
          </span>
        )}
        {record.status === 'DISCREPANCY_FLAGGED' && (
          <span className="inline-flex items-center gap-1 rounded-full border border-destructive-bg bg-destructive-bg px-2.5 py-0.5 text-xs font-medium text-destructive">
            <AlertTriangle className="h-3 w-3" />
            <span>{t('STATUS.DISCREPANCY_FLAGGED')}</span>
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5 text-center whitespace-nowrap">
        <div className="inline-flex items-center justify-center gap-1.5">
          {record.status === 'PENDING_APPROVAL' && (
            <>
              <button
                type="button"
                onClick={() => onApprove(record)}
                title={t('ACTIONS.APPROVE_CLEAR')}
                className="inline-flex items-center gap-1 rounded-md bg-success px-2.5 py-1.5 text-xs font-medium text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success min-h-[32px] motion-safe:transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{t('ACTIONS.APPROVE_CLEAR')}</span>
              </button>
              <button
                type="button"
                onClick={() => onFlag(record)}
                title={t('ACTIONS.FLAG_DISCREPANCY')}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1.5 text-xs font-medium text-destructive hover:bg-destructive-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive min-h-[32px] motion-safe:transition-colors"
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>{t('ACTIONS.FLAG_DISCREPANCY')}</span>
              </button>
            </>
          )}

          {record.status === 'DISCREPANCY_FLAGGED' && (
            <button
              type="button"
              onClick={() => onApprove(record)}
              title="Re-audit and Clear"
              className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[32px]"
            >
              <Check className="h-3.5 w-3.5 text-success" />
              <span>Re-audit & Clear</span>
            </button>
          )}

          {record.status === 'APPROVED' && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-success" />
              <span>{displayValue(record.approvedBy ?? 'Approved')}</span>
            </span>
          )}

          {record.bankDepositSlipUrl && (
            <a
              href={record.bankDepositSlipUrl}
              target="_blank"
              rel="noreferrer"
              title={t('ACTIONS.VIEW_SLIP')}
              className="inline-flex items-center justify-center p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[32px] min-w-[32px]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </td>
    </tr>
  );
}

export default AdminAccountsDailySettlementTableRow;

