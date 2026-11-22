'use client';
// Responsibility: AdminAccountsDailySettlementTableRow component owned by accounts_daily_settlement.

import type { DailySettlementRecord } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import {
formatPaiseToRupees,
formatSettlementDate,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/AdminAccountsDailySettlementFormatters';
import { displayValue } from '@/lib/display_value';
import { AlertTriangle,Check,Clock,ExternalLink,Printer,ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function printDailySettlementVoucher(record: DailySettlementRecord) {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=750,height=800');
  if (!printWindow) {
    window.print();
    return;
  }
  const isShortage = record.difference < 0;
  const isSurplus = record.difference > 0;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Daily Cash Handover Voucher - ${record.branchName} (${record.date})</title>
        <style>
          @page { size: A5 landscape; margin: 10mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px; }
          .logo { font-size: 16px; font-weight: 800; color: #047857; text-transform: uppercase; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
          .box-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
          th { background: #047857; color: #fff; padding: 6px; text-align: left; }
          td { padding: 6px; border-bottom: 1px solid #e2e8f0; }
          .highlight-row { background: #f0fdf4; font-weight: bold; }
          .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; margin-top: 20px; }
          .signature-box { width: 200px; border-top: 1px solid #000; text-align: center; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SMART LIBRARY NETWORK</div>
            <div style="font-size: 11px; color: #64748b;">Daily Cash Closing & Handover Voucher</div>
          </div>
          <div style="text-align: right;">
            <span class="badge" style="background:#dcfce7; color:#15803d;">DAILY SETTLEMENT</span>
            <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">Date: ${formatSettlementDate(record.date)}</div>
            <div style="font-size: 10px; color: #64748b;">Shift: ${record.shiftName}</div>
          </div>
        </div>

        <div class="grid">
          <div class="box">
            <div class="box-title">Branch & Shift Details</div>
            <div style="font-size: 13px; font-weight: bold;">${record.branchName}</div>
            <div style="color: #475569;">Handed Over By: <strong>${record.managerName}</strong></div>
            ${record.managerNotes ? `<div style="color: #64748b; font-size: 10px; margin-top: 4px;">Notes: ${record.managerNotes}</div>` : ''}
          </div>
          <div class="box">
            <div class="box-title">Audit Status</div>
            <div>Status: <strong style="text-transform: uppercase;">${record.status.replace(/_/g, ' ')}</strong></div>
            <div>Approved By: <strong>${record.approvedBy ?? 'Pending Audit'}</strong></div>
            ${record.bankReferenceNumber ? `<div>Bank Ref: ${record.bankReferenceNumber}</div>` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Cash Ledger Particulars</th>
              <th style="text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Opening Petty Cash Balance</td>
              <td style="text-align: right; font-family: monospace;">${formatPaiseToRupees(record.openingCash)}</td>
            </tr>
            <tr>
              <td>Daily Counter Cash Collected</td>
              <td style="text-align: right; font-family: monospace;">+${formatPaiseToRupees(record.cashCollected)}</td>
            </tr>
            <tr>
              <td>Daily UPI / Digital Collections (Direct to Bank)</td>
              <td style="text-align: right; font-family: monospace; color: #4f46e5;">${formatPaiseToRupees(record.upiCollected)}</td>
            </tr>
            <tr>
              <td>Petty Cash Expenses Paid</td>
              <td style="text-align: right; font-family: monospace; color: #b91c1c;">-${formatPaiseToRupees(record.expensesPaid)}</td>
            </tr>
            <tr style="border-top: 2px solid #cbd5e1;">
              <td><strong>Expected Drawer Cash</strong></td>
              <td style="text-align: right; font-family: monospace; font-weight: bold;">${formatPaiseToRupees(record.expectedClosingCash)}</td>
            </tr>
            <tr class="highlight-row">
              <td><strong>Actual Cash Handed Over to Admin/Bank</strong></td>
              <td style="text-align: right; font-family: monospace; font-size: 13px; color: #047857;">${formatPaiseToRupees(record.actualHandoverCash)}</td>
            </tr>
            <tr>
              <td>Cash Variance (Discrepancy)</td>
              <td style="text-align: right; font-family: monospace; font-weight: bold; color: ${isShortage ? '#b91c1c' : isSurplus ? '#047857' : '#64748b'};">
                ${record.difference === 0 ? '₹0.00 (Exact Match)' : formatPaiseToRupees(record.difference)}
              </td>
            </tr>
            ${record.resolutionAction ? `
            <tr style="background:#fff1f2;">
              <td><strong>Discrepancy Resolution Strategy</strong></td>
              <td style="text-align: right; font-weight: bold; color: #9f1239;">
                ${record.resolutionAction === 'DEDUCT_SALARY' ? 'Shortage scheduled for deduction from manager monthly payroll' : record.resolutionAction === 'CARRY_FORWARD' ? 'Shortage carried forward to tomorrow opening balance' : record.resolutionAction === 'IMMEDIATE_DEPOSIT' ? 'Difference reimbursed on spot at counter' : 'Waived as operational loss'}
              </td>
            </tr>` : ''}
          </tbody>
        </table>

        <div class="footer">
          <div class="signature-box">
            <span>Branch Manager Signature</span><br/>
            <small style="color: #64748b;">(${record.managerName})</small>
          </div>
          <div class="signature-box">
            <span>Admin / Auditor Signature</span><br/>
            <small style="color: #64748b;">(Smart Library Treasury)</small>
          </div>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

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
          <div className="flex flex-col items-center gap-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
              <AlertTriangle className="h-3 w-3" />
              <span>{t('STATUS.DISCREPANCY_FLAGGED')}</span>
            </span>
            {record.resolutionAction && (
              <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 shadow-xs">
                {record.resolutionAction === 'DEDUCT_SALARY' && 'Deduct: Salary'}
                {record.resolutionAction === 'CARRY_FORWARD' && 'Carry Forward'}
                {record.resolutionAction === 'IMMEDIATE_DEPOSIT' && 'Paid On-Spot'}
                {record.resolutionAction === 'WRITE_OFF' && 'Waived / Loss'}
              </span>
            )}
          </div>
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

          <button
            type="button"
            onClick={() => printDailySettlementVoucher(record)}
            title="Print Cash Handover Voucher"
            aria-label={`Print settlement voucher for ${record.branchName} on ${record.date}`}
            className="inline-flex items-center justify-center p-1.5 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-card-hover min-h-[32px] min-w-[32px] transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default AdminAccountsDailySettlementTableRow;

