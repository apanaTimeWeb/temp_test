// components/AdminAccountsDailySettlementDiscrepancyModal.tsx
'use client';

import type {
  DailySettlementRecord,
  DiscrepancyResolutionAction,
  FlagDiscrepancyPayload,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import { formatPaiseToRupees } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/AdminAccountsDailySettlementFormatters';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { AlertTriangle, ArrowRightCircle, CheckCircle2, CreditCard, Flag, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface Props {
  record: DailySettlementRecord | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (payload: FlagDiscrepancyPayload) => Promise<boolean>;
}

export function AdminAccountsDailySettlementDiscrepancyModal({
  record,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
}: Props) {
  const t = useTranslations('ADMIN_ACCOUNTS_DAILY_SETTLEMENT.MODAL_FLAG');
  const [reason, setReason] = useState<string>('CASH_SHORTAGE');
  const [resolutionAction, setResolutionAction] = useState<DiscrepancyResolutionAction>('DEDUCT_SALARY');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setReason('CASH_SHORTAGE');
      setResolutionAction('DEDUCT_SALARY');
      setNotes('');
      setError(null);
    }
  }, [record]);

  if (!record) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notes.trim().length < 5) {
      setError('Audit notes must be at least 5 characters long.');
      return;
    }

    const success = await onConfirm({
      settlementId: record.id,
      discrepancyReason: reason,
      resolutionAction,
      adminNotes: notes.trim(),
    });
    if (success) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isSubmitting) onClose(); }}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger-text" aria-hidden="true" />
              <DialogTitle>{t('TITLE')}</DialogTitle>
            </div>
            <DialogDescription>{t('DESCRIPTION')}</DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-danger bg-danger-bg p-3 text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-text-secondary">Branch:</span>
                <p className="font-semibold text-text-primary">{record.branchName}</p>
              </div>
              <div>
                <span className="text-text-secondary">Manager:</span>
                <p className="font-semibold text-text-primary">{record.managerName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-border pt-2">
              <div>
                <span className="text-text-secondary">Expected:</span>
                <p className="font-mono text-text-primary font-medium">{formatPaiseToRupees(record.expectedClosingCash)}</p>
              </div>
              <div>
                <span className="text-text-secondary">Reported Handover:</span>
                <p className="font-mono text-text-primary font-semibold">{formatPaiseToRupees(record.actualHandoverCash)}</p>
              </div>
            </div>

            <div className="border-t border-border pt-2 flex items-center justify-between">
              <span className="text-text-secondary">Calculated Variance:</span>
              <span className={`font-mono font-bold ${record.difference < 0 ? 'text-danger-text' : 'text-success-text'}`}>
                {formatPaiseToRupees(record.difference)}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="discrepancy-reason" className="block text-xs font-semibold text-text-primary">
              {t('REASON_LABEL')}
            </label>
            <select
              id="discrepancy-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              <option value="CASH_SHORTAGE">{t('REASONS.CASH_SHORTAGE')}</option>
              <option value="MISSING_SLIP">{t('REASONS.MISSING_SLIP')}</option>
              <option value="UNAUTHORIZED_EXPENSE">{t('REASONS.UNAUTHORIZED_EXPENSE')}</option>
              <option value="RECORD_MISMATCH">{t('REASONS.RECORD_MISMATCH')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-text-primary">
              Recovery &amp; Adjustment Action (शॉर्टेज समाधान) *
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 motion-safe:transition-colors ${
                  resolutionAction === 'DEDUCT_SALARY'
                    ? 'border-danger bg-danger-bg ring-1 ring-danger'
                    : 'border-border bg-card hover:bg-surface-hover'
                }`}
              >
                <input
                  type="radio"
                  name="resolutionAction"
                  value="DEDUCT_SALARY"
                  checked={resolutionAction === 'DEDUCT_SALARY'}
                  onChange={() => setResolutionAction('DEDUCT_SALARY')}
                  className="mt-0.5 text-danger-text focus:ring-danger"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                    <CreditCard className="h-3.5 w-3.5 text-danger-text" aria-hidden="true" />
                    <span>Deduct from Salary</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-tight">
                    Debit shortage from {record.managerName}&apos;s next monthly payroll disbursement.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 motion-safe:transition-colors ${
                  resolutionAction === 'CARRY_FORWARD'
                    ? 'border-warning bg-warning-bg ring-1 ring-warning'
                    : 'border-border bg-card hover:bg-surface-hover'
                }`}
              >
                <input
                  type="radio"
                  name="resolutionAction"
                  value="CARRY_FORWARD"
                  checked={resolutionAction === 'CARRY_FORWARD'}
                  onChange={() => setResolutionAction('CARRY_FORWARD')}
                  className="mt-0.5 text-warning-text focus:ring-warning"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                    <ArrowRightCircle className="h-3.5 w-3.5 text-warning-text" aria-hidden="true" />
                    <span>Carry-Forward Deficit</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-tight">
                    Carry forward liability to tomorrow&apos;s shift opening cash balance.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 motion-safe:transition-colors ${
                  resolutionAction === 'IMMEDIATE_DEPOSIT'
                    ? 'border-success bg-success-bg ring-1 ring-success'
                    : 'border-border bg-card hover:bg-surface-hover'
                }`}
              >
                <input
                  type="radio"
                  name="resolutionAction"
                  value="IMMEDIATE_DEPOSIT"
                  checked={resolutionAction === 'IMMEDIATE_DEPOSIT'}
                  onChange={() => setResolutionAction('IMMEDIATE_DEPOSIT')}
                  className="mt-0.5 text-success-text focus:ring-success"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success-text" aria-hidden="true" />
                    <span>Immediate Deposit</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-tight">
                    Manager deposited the cash shortage difference at counter immediately.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 motion-safe:transition-colors ${
                  resolutionAction === 'WRITE_OFF'
                    ? 'border-border-focus bg-surface-highlight ring-1 ring-primary'
                    : 'border-border bg-card hover:bg-surface-hover'
                }`}
              >
                <input
                  type="radio"
                  name="resolutionAction"
                  value="WRITE_OFF"
                  checked={resolutionAction === 'WRITE_OFF'}
                  onChange={() => setResolutionAction('WRITE_OFF')}
                  className="mt-0.5 text-primary focus:ring-primary"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                    <ShieldAlert className="h-3.5 w-3.5 text-text-secondary" aria-hidden="true" />
                    <span>Waive / Loss Absorption</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-tight">
                    Waive deficit as authorized operational variance / library expense.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="discrepancy-notes" className="block text-xs font-semibold text-text-primary">
              {t('NOTES_LABEL')}
            </label>
            <textarea
              maxLength={1000}
              id="discrepancy-notes"
              rows={3}
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setError(null); }}
              placeholder={t('NOTES_PLACEHOLDER')}
              disabled={isSubmitting}
              required
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            />
            {error && <p className="text-xs text-danger-text font-medium">{error}</p>}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              {t('CANCEL')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-md bg-danger px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:opacity-50 motion-safe:transition-opacity"
            >
              <Flag className="h-4 w-4" aria-hidden="true" />
              <span>{isSubmitting ? 'Flagging...' : t('SUBMIT')}</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminAccountsDailySettlementDiscrepancyModal;
