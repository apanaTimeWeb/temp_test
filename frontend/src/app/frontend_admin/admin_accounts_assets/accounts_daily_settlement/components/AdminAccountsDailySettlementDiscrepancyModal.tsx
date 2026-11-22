// components/AdminAccountsDailySettlementDiscrepancyModal.tsx
'use client';
import type { DailySettlementRecord,DiscrepancyResolutionAction,FlagDiscrepancyPayload } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import { formatPaiseToRupees } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/AdminAccountsDailySettlementFormatters';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { AlertTriangle,ArrowRightCircle,CheckCircle2,CreditCard,Flag,ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect,useState } from 'react';

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

    const payload: FlagDiscrepancyPayload = {
      settlementId: record.id,
      discrepancyReason: reason,
      resolutionAction,
      adminNotes: notes.trim(),
    };

    const success = await onConfirm(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isSubmitting) onClose(); }}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <DialogTitle>{t('TITLE')}</DialogTitle>
            </div>
            <DialogDescription>{t('DESCRIPTION')}</DialogDescription>
          </DialogHeader>

          {/* Settlement Context Snapshot */}
          <div className="rounded-lg border border-destructive-bg bg-destructive-bg p-3 text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Branch:</span>
                <p className="font-semibold text-foreground">{record.branchName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Manager:</span>
                <p className="font-semibold text-foreground">{record.managerName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-border pt-2">
              <div>
                <span className="text-muted-foreground">Expected:</span>
                <p className="font-mono text-foreground font-medium">{formatPaiseToRupees(record.expectedClosingCash)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Reported Handover:</span>
                <p className="font-mono text-foreground font-semibold">{formatPaiseToRupees(record.actualHandoverCash)}</p>
              </div>
            </div>

            <div className="border-t border-border pt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Calculated Variance:</span>
              <span className={`font-mono font-bold ${record.difference < 0 ? 'text-destructive' : 'text-success'}`}>
                {formatPaiseToRupees(record.difference)}
              </span>
            </div>
          </div>

          {/* Form Input: Reason */}
          <div className="space-y-1.5">
            <label htmlFor="discrepancy-reason" className="block text-xs font-semibold text-foreground">
              {t('REASON_LABEL')}
            </label>
            <select
              id="discrepancy-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              <option value="CASH_SHORTAGE">{t('REASONS.CASH_SHORTAGE')}</option>
              <option value="MISSING_SLIP">{t('REASONS.MISSING_SLIP')}</option>
              <option value="UNAUTHORIZED_EXPENSE">{t('REASONS.UNAUTHORIZED_EXPENSE')}</option>
              <option value="RECORD_MISMATCH">{t('REASONS.RECORD_MISMATCH')}</option>
            </select>
          </div>

          {/* Recovery / Adjustment Action Strategy */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              Recovery & Adjustment Action (शॉर्टेज समाधान) *
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-all ${
                  resolutionAction === 'DEDUCT_SALARY'
                    ? 'border-destructive bg-destructive/10 ring-1 ring-destructive'
                    : 'border-border bg-card hover:bg-card-hover'
                }`}
              >
                <input
                  type="radio"
                  name="resolutionAction"
                  value="DEDUCT_SALARY"
                  checked={resolutionAction === 'DEDUCT_SALARY'}
                  onChange={() => setResolutionAction('DEDUCT_SALARY')}
                  className="mt-0.5 text-destructive focus:ring-destructive"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <CreditCard className="h-3.5 w-3.5 text-destructive" />
                    <span>Deduct from Salary</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Debit shortage from {record.managerName}&apos;s next monthly payroll disbursement.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-all ${
                  resolutionAction === 'CARRY_FORWARD'
                    ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                    : 'border-border bg-card hover:bg-card-hover'
                }`}
              >
                <input
                  type="radio"
                  name="resolutionAction"
                  value="CARRY_FORWARD"
                  checked={resolutionAction === 'CARRY_FORWARD'}
                  onChange={() => setResolutionAction('CARRY_FORWARD')}
                  className="mt-0.5 text-amber-500 focus:ring-amber-500"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <ArrowRightCircle className="h-3.5 w-3.5 text-amber-500" />
                    <span>Carry-Forward Deficit</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Carry forward liability to tomorrow&apos;s shift opening cash balance.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-all ${
                  resolutionAction === 'IMMEDIATE_DEPOSIT'
                    ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
                    : 'border-border bg-card hover:bg-card-hover'
                }`}
              >
                <input
                  type="radio"
                  name="resolutionAction"
                  value="IMMEDIATE_DEPOSIT"
                  checked={resolutionAction === 'IMMEDIATE_DEPOSIT'}
                  onChange={() => setResolutionAction('IMMEDIATE_DEPOSIT')}
                  className="mt-0.5 text-emerald-500 focus:ring-emerald-500"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Immediate Deposit</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Manager deposited the cash shortage difference at counter immediately.
                  </p>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-all ${
                  resolutionAction === 'WRITE_OFF'
                    ? 'border-slate-500 bg-slate-500/10 ring-1 ring-slate-500'
                    : 'border-border bg-card hover:bg-card-hover'
                }`}
              >
                <input
                  type="radio"
                  name="resolutionAction"
                  value="WRITE_OFF"
                  checked={resolutionAction === 'WRITE_OFF'}
                  onChange={() => setResolutionAction('WRITE_OFF')}
                  className="mt-0.5 text-slate-500 focus:ring-slate-500"
                />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                    <span>Waive / Loss Absorption</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Waive deficit as authorized operational variance / library expense.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Form Input: Notes */}
          <div className="space-y-1.5">
            <label htmlFor="discrepancy-notes" className="block text-xs font-semibold text-foreground">
              {t('NOTES_LABEL')}
            </label>
            <textarea
              id="discrepancy-notes"
              rows={3}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setError(null);
              }}
              placeholder={t('NOTES_PLACEHOLDER')}
              disabled={isSubmitting}
              required
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            />
            {error && (
              <p className="text-xs text-destructive font-medium">{error}</p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              {t('CANCEL')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive disabled:opacity-50 motion-safe:transition-colors"
            >
              <Flag className="h-4 w-4" />
              <span>{isSubmitting ? 'Flagging...' : t('SUBMIT')}</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminAccountsDailySettlementDiscrepancyModal;

