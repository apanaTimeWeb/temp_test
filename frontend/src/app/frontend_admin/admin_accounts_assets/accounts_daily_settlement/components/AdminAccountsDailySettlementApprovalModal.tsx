// components/AdminAccountsDailySettlementApprovalModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import type { DailySettlementRecord, ApproveSettlementPayload } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import { formatPaiseToRupees, formatSettlementDate } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/AdminAccountsDailySettlementFormatters';
import { displayValue } from '@/lib/display_value';

interface Props {
  record: DailySettlementRecord | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (payload: ApproveSettlementPayload) => Promise<boolean>;
}

export function AdminAccountsDailySettlementApprovalModal({
  record,
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
}: Props) {
  const t = useTranslations('ADMIN_ACCOUNTS_DAILY_SETTLEMENT.MODAL_APPROVE');
  const [verifiedRupees, setVerifiedRupees] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setVerifiedRupees((record.actualHandoverCash / 100).toString());
      setAdminNotes('');
      setValidationError(null);
    }
  }, [record]);

  if (!record) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedRupees = parseFloat(verifiedRupees);
    if (isNaN(parsedRupees) || parsedRupees < 0) {
      setValidationError('Please enter a valid positive verified cash amount.');
      return;
    }

    const payload: ApproveSettlementPayload = {
      settlementId: record.id,
      verifiedCashAmount: Math.round(parsedRupees * 100),
      adminNotes: adminNotes.trim() ? adminNotes.trim() : undefined,
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
              <ShieldCheck className="h-5 w-5 text-success" />
              <DialogTitle>{t('TITLE')}</DialogTitle>
            </div>
            <DialogDescription>{t('DESCRIPTION')}</DialogDescription>
          </DialogHeader>

          {/* Settlement Details Summary Card */}
          <div className="rounded-lg border border-border bg-muted/40 p-3.5 text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">{t('BRANCH')}:</span>
                <p className="font-semibold text-foreground">{record.branchName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t('MANAGER')}:</span>
                <p className="font-semibold text-foreground">{record.managerName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-border pt-2">
              <div>
                <span className="text-muted-foreground">Date & Shift:</span>
                <p className="text-foreground">{formatSettlementDate(record.date)} · {record.shiftName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Bank Reference:</span>
                <p className="font-mono text-foreground">{displayValue(record.bankReferenceNumber)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-border pt-2">
              <div>
                <span className="text-muted-foreground">{t('EXPECTED')}:</span>
                <p className="font-mono text-foreground font-medium">{formatPaiseToRupees(record.expectedClosingCash)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t('ACTUAL')}:</span>
                <p className="font-mono text-foreground font-semibold">{formatPaiseToRupees(record.actualHandoverCash)}</p>
              </div>
            </div>

            {record.bankDepositSlipUrl ? (
              <div className="border-t border-border pt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Bank Deposit Slip:</span>
                <a
                  href={record.bankDepositSlipUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                >
                  <span>View Attached Slip</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ) : (
              <div className="border-t border-border pt-2 text-muted-foreground italic">
                {t('NO_SLIP')}
              </div>
            )}
          </div>

          {/* Form Input: Verified Cash */}
          <div className="space-y-1.5">
            <label htmlFor="verified-cash" className="block text-xs font-semibold text-foreground">
              {t('VERIFIED_AMOUNT_LABEL')}
            </label>
            <input
              id="verified-cash"
              type="number"
              step="any"
              min="0"
              value={verifiedRupees}
              onChange={(e) => {
                setVerifiedRupees(e.target.value);
                setValidationError(null);
              }}
              required
              disabled={isSubmitting}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            />
            {validationError && (
              <p className="text-xs text-destructive font-medium">{validationError}</p>
            )}
          </div>

          {/* Form Input: Admin Notes */}
          <div className="space-y-1.5">
            <label htmlFor="admin-notes" className="block text-xs font-semibold text-foreground">
              {t('ADMIN_NOTES_LABEL')}
            </label>
            <textarea
              id="admin-notes"
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={t('ADMIN_NOTES_PLACEHOLDER')}
              disabled={isSubmitting}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            />
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
              className="inline-flex items-center gap-1.5 rounded-md bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success disabled:opacity-50 motion-safe:transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isSubmitting ? 'Verifying...' : t('SUBMIT')}</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminAccountsDailySettlementApprovalModal;

