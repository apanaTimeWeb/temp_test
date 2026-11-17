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
          <span className="inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            {formatPaiseToRupees(record.difference)}
          </span>
        ) : isSurplus ? (
          <span className="inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            +{formatPaiseToRupees(record.difference)}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">₹0.00</span>
        )}
      </td>

      {/* Status Badge */}
      <td className="px-4 py-3.5 text-center whitespace-nowrap">
        {record.status === 'PENDING_APPROVAL' && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            <Clock className="h-3 w-3" />
            <span>{t('STATUS.PENDING_APPROVAL')}</span>
          </span>
        )}
        {record.status === 'APPROVED' && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            <Check className="h-3 w-3" />
            <span>{t('STATUS.APPROVED')}</span>
          </span>
        )}
        {record.status === 'DISCREPANCY_FLAGGED' && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
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
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[32px] motion-safe:transition-all hover:scale-[1.02]"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{t('ACTIONS.APPROVE_CLEAR')}</span>
              </button>
              <button
                type="button"
                onClick={() => onFlag(record)}
                title={t('ACTIONS.FLAG_DISCREPANCY')}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1.5 text-xs font-semibold text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 min-h-[32px] motion-safe:transition-all"
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[32px] motion-safe:transition-all"
            >
              <Check className="h-3.5 w-3.5 text-amber-400" />
              <span>Re-audit & Clear</span>
            </button>
          )}

          {record.status === 'APPROVED' && (
            <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>{displayValue(record.approvedBy ?? 'Approved')}</span>
            </span>
          )}

          {record.bankDepositSlipUrl && (
            <a
              href={record.bankDepositSlipUrl}
              target="_blank"
              rel="noreferrer"
              title={t('ACTIONS.VIEW_SLIP')}
              className="inline-flex items-center justify-center p-1.5 rounded-md text-primary hover:text-primary-foreground hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[32px] min-w-[32px]"
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

